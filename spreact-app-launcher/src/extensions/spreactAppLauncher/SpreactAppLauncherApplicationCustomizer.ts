// import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { sp } from '@pnp/sp';
import SPProvider from '../../Provider/SPProvider';

// import * as strings from 'SpreactAppLauncherApplicationCustomizerStrings';

// const LOG_SOURCE: string = 'SpreactAppLauncherApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpreactAppLauncherApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpreactAppLauncherApplicationCustomizer
  extends BaseApplicationCustomizer<ISpreactAppLauncherApplicationCustomizerProperties> {

    //<link rel="preload" href="https://publiccdn.sharepointonline.com/rotarex.sharepoint.com/sites/TravelPerk/ClientSideAssets/712feaac-4467-48b6-80aa-a64a37caea97/tile-menu-web-part-web-part_55248c0bbc7b6ac3bc8e.js" as="script" crossorigin="">
  public loadApp(appid: string, apptitle: string): void {
    const __host = window.location.host;
    if (appid) {
      console.log(`Loading custom app ${appid}`);
      const jsUrl = `https://publiccdn.sharepointonline.com/${__host}/ClientSideApps/${appid}/main.js`
      const cssUrl: string = `https://publiccdn.sharepointonline.com/${__host}/ClientSideApps/${appid}/main.css`
      const iconUrl: string = `https://publiccdn.sharepointonline.com/${__host}/ClientSideApps/${appid}/favicon.ico`
      console.log(jsUrl);
      // update title
      const head = document.getElementsByTagName("head")[0] || document.documentElement;
      const titleElement = document.createElement("title")
      titleElement.text = apptitle;
      head.insertAdjacentElement("afterbegin", titleElement);

      //update icon
      const appIcon: HTMLLinkElement = document.getElementById('favicon') as HTMLLinkElement;
      appIcon.href = iconUrl;
      //inject css
      if (document.getElementById('SPReactStyle') === null) {
        const customStyle: HTMLLinkElement = document.createElement("link");
        customStyle.id = "SPReactStyle"
        customStyle.href = cssUrl;
        customStyle.rel = "stylesheet";
        head.insertAdjacentElement("afterbegin", customStyle);
      }
      //inject javascript
      if (document.getElementById('SPReactScript') === null) {
        const customScript: HTMLScriptElement = document.createElement("script");
        customScript.id = "SPReactScript"
        customScript.src = jsUrl;
        customScript.setAttribute("rel", "preload");
        customScript.setAttribute("defer", "defer");
        customScript.setAttribute("as", "script");
        customScript.setAttribute("crossorigin", "");
        head.insertAdjacentElement("afterbegin", customScript);
      }
      //inject root
      if (document.getElementById('root') === null) {
        const rootDiv: HTMLDivElement = document.createElement("div");
        rootDiv.id = "root";
        rootDiv.style.minHeight = (window.innerHeight - 100) + "px";
        document.body.insertAdjacentElement("afterbegin", rootDiv);
      }

      //inject noscript element
      if (document.getElementById('noscript') === null) {
        const noscript = document.createElement("noscript");
        noscript.id = "noscript"
        noscript.textContent = "You need to enable JavaScript to run this app."
        document.body.insertAdjacentElement("afterbegin", noscript);
      }

      //custom css for hiding sharepoint elements
      (document.getElementsByClassName('SPPageChrome')[0] as any).style.display = 'none';

    }
  }

  public onInit(): Promise<void> {
    const __currentlink = window.location.origin + window.location.pathname
    const __siteUrl = this.context.pageContext.site.absoluteUrl;
    if (__currentlink !== __siteUrl) {

      if (__currentlink.indexOf("/SitePages/") === -1) {
        if (__currentlink.indexOf("/Pages/") === -1) {
          return Promise.resolve();
        }
      }

      if (window.location.href.replace(__siteUrl, '').indexOf("/Forms/") > -1) {
        return Promise.resolve();
      }
    }

    //workbench loading
    if (window.location.search.toLowerCase().indexOf("workbench=true") > -1) {
      const urlParams = new URLSearchParams(window.location.search);
      const host = urlParams.get('host');
      if (host != null) {
        console.log('running workbench of SPREACT launder app...');
        const head = document.getElementsByTagName("head")[0] || document.documentElement;
        const jsUrl = `http://${host}/static/js/bundle.js`
        //inject javascript
        if (document.getElementById('SPReactScript') === null) {
          const customScript: HTMLScriptElement = document.createElement("script");
          customScript.id = "SPReactScript"
          customScript.src = jsUrl;
          customScript.setAttribute("defer", "defer")
          head.insertAdjacentElement("afterbegin", customScript);
        }
        //inject root
        if (document.getElementById('root') === null) {
          const rootDiv: HTMLDivElement = document.createElement("div");
          rootDiv.id = "root";
          rootDiv.style.minHeight = (window.innerHeight - 100) + "px";
          document.body.insertAdjacentElement("afterbegin", rootDiv);
        }
        //custom css for hiding sharepoint elements
        (document.getElementsByClassName('SPPageChrome')[0] as any).style.display = 'none';
        return Promise.resolve();
      }
    }

    if (window.location.search.toLowerCase().indexOf("skip=true") > -1) {
      console.log('skipping SPREACT launder app...');
      return Promise.resolve();
    }



    console.log('Initializing SPREACT launder app...');

    const __host = window.location.host + '/sites/apps';
    console.log('setting up pnpjs...');
    sp.setup({ spfxContext: this.context as any });
    const spProvider = new SPProvider();
    console.log('SiteURL : ' + __siteUrl);
    return new Promise<void>((resolve, reject) => {
      console.log('reading app config list : ' + __siteUrl);
      spProvider.getAppConfig().then((items) => {
        if (items.length === 0) {
          console.log('connecting app catalog site...');
          spProvider.getinstalledApps("https://" + __host).then((apps) => {
            const installedApps = apps.filter((a: any) => a.HostSPSite.indexOf(__siteUrl) > -1);
            console.log(installedApps);
            if (installedApps !== null && installedApps.length > 0) {
              spProvider.addAppConfig(installedApps[0]).then((v) => {
                console.log('app added in the app config list');
              }).catch((ex) => {
                console.log(ex);
                reject(ex);
              });
              this.loadApp(installedApps[0].appId, installedApps[0].appTitle);
              resolve();
            }
          }).catch((error) => {
            console.log(error);
            reject(error);
          })
        }
        else {
          //load script
          console.log(items[0].appId);
          this.loadApp(items[0].appId, items[0].appTitle);
          resolve();
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }
}
