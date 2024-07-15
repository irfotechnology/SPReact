

export default class deployment_config {
    public getConfig(baseUrl:string){
        return{
            tanentPath : baseUrl,
            cdnPath: `/ClientSideApps`,
            tempPath: `/ClientSideApps/temp`,
            appCatlogPath: `/sites/apps/SPREACT/AppforSPReact`,
            appCatlogTitle: 'App for SPReact'
        }
    }

}