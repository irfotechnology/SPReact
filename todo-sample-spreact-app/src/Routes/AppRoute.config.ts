import About from "../Views/About";
import Home from "../Views/Home";
import Notes from "../Views/Notes";

export const AppRouteConfig ={
    pages : [
        { name: 'Home', isVisible: true, href: '/', component: Home },
        { name: 'Notes', isVisible: false, href: '/notes/:id', component: Notes },
        { name: 'About', isVisible: true, href: '/About', component: About }
    ]
}

export default AppRouteConfig;
//use this instead of module.exports 



