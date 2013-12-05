/**
 * Created by Osama on 12/5/13.
 * angular social sharing module based on socialite
 */


/**
 *
 * Tasks:
 *
 * a)load socialite as soon as you detect an html attribute that has socilaite css class ?
 *
 *
 * b)create a directive that will output all the social stuff by using the current url (default)
 * and load socialite after  (what if you want to exculde some sites? (you specify)
 * so, by default: share current url, and load all social sites.
 * you can specify some social networks
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

angular.module('ngSociali', [])
    //angularjs directive to handle outputting the template
    .directive('ngSocialite',[,function(){
        var ngSocial = {
            restrict : 'AC',
            replace  : true,
            scope    : {
                id : '=disqus',
                exclude: '=exclude'
            },
            //check the list of exclusions ?
            link: function link(scope) {
               //link right away?

                console.log(this.scope);


            }
        };

        return ngSocial;

    }])


