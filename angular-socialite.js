/**
 * Created by Osama on 12/5/13.
 * angular social sharing module based on socialite
 *
 * version 1.0 : built on top of socilaitjs.
 * next version will introduce a socialitejsLess build which allow u to register networks using directives
 */


/**
 *
 * How to register and add new social networks
 * create a directive
 * require ngSocialite
 * call controller copy to get the attributes from parent and push for reload in case a certain attrbute has changed
 * reuse socialite as much as possible (I haven't solved the issue of having multiple directives using attributes that require network reload other than requesting the file again
 *
 *
 *
 *
 *
 *
 */

//Supported widgets are currently:
//
//Facebook: facebook-like
//Twitter: twitter-share, twitter-follow, twitter-mention, twitter-hashtag and twitter-embed (for individual tweets)
//Google+: googleplus-one, googleplus-share, googleplus-badge
//LinkedIn: linkedin-share, linkedin-recommend


//Also available as extensions:
//
//Pinterest: pinterest-pinit
//Spotify: spotify-play
//Hacker News: hackernews-share
//GitHub: github-watch, github-fork, github-follow

//go through all the already configured network setups and see which ones are excluded
//then output them
//create

//            <li>
//                <a href="http://twitter.com/share" class="socialite twitter-share" data-text="Socialite.js" data-url="http://socialitejs.com" data-count="vertical" rel="nofollow" target="_blank"><span class="vhidden">Share on Twitter</span></a>
//            </li>
//                <li>
//                <a href="https://plus.google.com/share?url=http://socialitejs.com" class="socialite googleplus-one" data-size="tall" data-href="http://socialitejs.com" rel="nofollow" target="_blank"><span class="vhidden">Share on Google+</span></a>
//            </li>
//                <li>
//                    <a href="http://www.facebook.com/sharer.php?u=http://www.socialitejs.com&t=Socialite.js" class="socialite facebook-like" data-href="http://socialitejs.com" data-send="false" data-layout="box_count" data-width="60" data-show-faces="false" rel="nofollow" target="_blank"><span class="vhidden">Share on Facebook</span></a>
//                </li>
//                <li>
//                <a href="http://www.linkedin.com/shareArticle?mini=true&url=http://socialitejs.com&title=Socialite.js" class="socialite linkedin-share" data-url="http://socialitejs.com" data-counter="top" rel="nofollow" target="_blank"><span class="vhidden">Share on LinkedIn</span></a>
//            </li>
//            <li>
//                <a href="http://www.linkedin.com/shareArticle?mini=true&url=http://socialitejs.com&title=Socialite.js" class="socialite linkedin-share" data-url="http://socialitejs.com" data-counter="top" rel="nofollow" target="_blank"><span class="vhidden">Share on LinkedIn</span></a>
//            </li>

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

var socialiteModule = angular.module('ngSocialite', []);


//provider for this modules
/**
 * Socialite provider.
 *
 * all the values here are set to the global scope
 */
socialiteModule.provider('$social', function() {



    //you have to register the attributes here through provider
    var ATTRIBUTES = {

        //all the attributes shared accorss all directives
        shared:{}


    };


    var SETTINGS = {


    };

    //reference to Socialite Instance
    var Socialite;







    this.setLanguage = function (lang){

        language = lang ;

    }

    function getLanguage() {


        return language;


    }



    // Provider constructor
    this.$get = [ '$location','$routeParams','$rootScope', function($location,$routeParams,$rootScope) {



        //settings for the social network
        //accepts the object which include the settings similar to how socialite does it
        //it will eventually be mapped to socilaite's settings object
        //WILL BE DEPRECATED IN THE SECOND VERSION
        function setSettings (object){


            Socialite.setup(settings);

        }

        function getSettings (){

            return Socialite.settings;

        }



        //@param1: these properties are shared among all directives (NgSocialite only)
        //@param2: array that will be either added or concatenated
        function setAttribute(property,object){
            //use socialite utility method to copy the properties of one object to the other and overwrite
            for(var key in object) {
                //set the value of the attr if the object sent isn't null
                if(object[key]){
                    Socialite.extendObject(ATTRIBUTES[property],object,true);
                }

            }

        }


        //a property could be shared or facebook or twitter for more specific
        function getAttribute(property){

            return ATTRIBUTES[property];

        }

        /**
         * Bind all values to the scope after checking the attributes are good ?
         *
         * this is called after changes have been made to the $social vlaues to rebind the values to scope
         */
        function copy(scope){
            //set the default values according to how $social was initialized ..
            var sharedAttributes = getAttribute("shared");
            for(var key in sharedAttributes) {
                //set the default values in case the attributes aren't defined
                if(!scope[key]){
                    console.log(sharedAttributes[key]);
                    //meaning it's not defined, set it to the default
                    scope[key] = getAttribute("shared")[key];


                }

            }

        }



        //FUTURE: attach the script if it's not attached
        function init(){

            //this method will handle setting values if they aren't defined


            if(!angular.isDefined(window.Socialite)) {

                throw new Error("Socialite not loaded! make sure to download it from https://github.com/tmort/Socialite and include it");

            }
            else{

                //copy the instance over
                Socialite = window.Socialite;

            }

            //set the language defined by the socialProvider as a shared attributes
            //this again means that the parent directive will copy this value if it's not provided
            setAttribute("shared",{lang:getLanguage()});


        }


        //initialize
        init();

        // Expose public api not for the provider but for $SOCIAL ...
        return {
            lang:getLanguage,
            setLanguage:this.setLanguage,
            getLanguage:getLanguage,
            setSettings:setSettings,
            getSettings:getSettings,
            setAttribute:setAttribute,
            getAttribute:getAttribute,
            copy:copy,
            //access to the socialite object for further customization
            Socialite:Socialite

        };

    }];


});




/**
 * angularjs directive to handle outputting the template
 *
 * it will also handle styling the elements (Socialnetworks) underneath it
 *
 * @param  {String} id required thread id
 */
    socialiteModule.directive('ngSocialite',["$location","$social","$rootScope","$timeout",function($location,$social,$rootScope,$timeout){

        //how is Socialite loaded?
        //callbacks when tweet is clicked and follow button is clicked ...
        var ngSocial = {
            restrict : "E",
            //this is a shared attribute
            //this is how you define shared attributes
            //prepending them with socialite just to distinguish
            scope:{
               url:"@url",
               text:"@text",
               lang:"@lang",
               trigger:"@trigger"
            },
            template: "<div id='socialite' ng-transclude><p style='width:100px;height:100px'>body</p></div>",
            transclude: true,
            replace:false,
            link: function ($scope, $element, $attrs) {



            },
            controller:function($scope,$social,$timeout,$location){

                //create new socialite instance for every controller, because we don't want two directives to overlap with each other



                //FUTURE:come up with an effective way of managing the on events with multiple socialite instances
                //or tell the user to specify their settings with the provider is initialized



                //prepare everything on the controller upon initialization ..
                //INITIALIZATION
                $scope.$watch("url",function(){

                    //set the shared attributes
                    $social.setAttribute("shared",{lang:$scope.lang});

                    //if the url isn't defined
                    //I can move this to the set Attribute method
                    if(!$scope.url){

                        $social.setAttribute("shared",{url:$location.absUrl()});


                    }
                    else{

                        $social.setAttribute("shared",{url:$scope.url});


                    }

                    $social.setAttribute("shared",{text:$scope.text});


                    //how each item is going to be triggered (hover,onload)
                    if(!$scope.trigger || $scope.trigger != "hover" && $scope.trigger != "onload"){

                        $social.setAttribute("shared",{trigger:"onload"});


                    }
                    else{
                        $social.setAttribute("shared",{trigger:$scope.trigger});

                    }


                    //set this scope to whatever the user set as default in the social provider
                    //copy parent scope to child's
                    $social.copy($scope,$social);



                     //register hover event for the socialite element in case the user wants to trigger on hover
                    if($scope.trigger == "hover"){

                        console.log("entered hover");
                        var socialiteElement = angular.element(document.getElementById("socialite"));
                        socialiteElement.hover(function(){

                            $social.Socialite.load();

                        });

                    }


                });




                //load Soclialite instance
                this.load = function(){

                    //setup the network according to the directive specified
                    $social.Socialite.load();

                }

                //bind the scope of children to the parent scope
                this.copy = function(scope){


                    //transfer only shared keys from parent scope
                    var sharedAttributes = $social.getAttribute("shared");
                    for(var key in sharedAttributes) {
                        //set the default values in case the attributes aren't defined
                        if(!scope[key]){
                            //meaning it's not defined, set it to the default
                            scope[key] = $scope[key];


                        }

                    }

                    //refresh the network or not depending on what the directive has sent to you


                  //this timeout is used as I have no clue how to know when the scope here is copied over and added to the template
                  //FUTURE:load the specific instance when directive is coppied over
                    if($scope.trigger == "onload"){
                        $timeout(this.load,100);
                    }

                }


            }
        };

        return ngSocial;

    }]);

//HOW TO MAKE THIS DIRECTIVE STAND ALONE?
socialiteModule.directive("twitter", function() {
    var twitter = {
        require:"^ngSocialite",
        restrict: 'E',
        replace:true,
        scope:{
    url:"@url",
    text:"@text",
    lang:"@lang",
    widget :"@widget",
    via : "@via",
    link : "@link",
    related : "@related",
    count : "@count",
    counturl : "@counturl",
    hashtags : "@hashtags",
    size : "@size",
    dnt : "@dnt",
    onclick    : "@onclick",
    ontweet    : "@ontweet",
    onretweet  : "@onretweet",
    onfavorite : "@onfavorite",
    onfollow   : "@onfollow"
        },
        template: "<li>"+
                "<a ng-href='{{link}}' class='socialite {{ad}} twitter-{{widget}}' data-text='{{text}}' data-url='{{url}}' data-via='{{via}}' data-lang='{{lang}}' data-hashtags='{{hashtags}}' data-size='{{size}}' data-dnt='{{dnt}}' data-related='google chrome' data-count='{{count}}' data-counturl='{{counturl}}' rel='nofollow' target='_blank'><span  class='vhidden'>Share on Twitter</span></a>"+
           "</li> ",
        link: function(scope, element, attrs,controller) {



            /**
             *
             *  Tweet Button
             */
            //    url	URL of the page to share
            //    text	Default Tweet text
            //    lang	The language for the Tweet Button
            //    via	Screen name of the user to attribute the Tweet to
            //    related	Related accounts, displayed after the user sends the tweet, as a suggestion to follow
            //    count	 Count box position  (none,horizontal,vertical)
            //    counturl	URL to which your shared URL resolves. this is used when u use a shorten url and u want to make sure it resolves to the correct address
            //    hashtags	Comma separated hashtags appended to tweet text
            //    size	The size of the rendered button
            //    dnt	set to true if you want to opt out of twitter suggestion

            /**
             *
             *  follow button
             */
//            User to follow	        (in the anchor URL)
//            Followers count display	data-show-count
//            Language	                data-lang
//            Width	                    data-width
//            Alignment	                data-align
//            Show Screen Name	        data-show-screen-name
//            Size	                    data-size
//            Opt Out	                data-dnt


//           var twitter_settings ={twitter: {
//                    lang       : 'ru',
//                    onclick    : function(e) { /* ... */ },
//                    ontweet    : function(e) {console.log(scope.ontweet)},
//                    onretweet  : function(e) { /* ... */ },
//                    onfavorite : function(e) { /* ... */ },
//                    onfollow   : function(e) { /* ... */ }
//                }};



            //list of twitter attributes ... here for tweet button
            //twitter:[ "widget", "via", "related", "count","counturl" ,"hashtags", "size", "dnt" ]


            //bind to the scope the shared attributes that are not bound yet ...
            scope.$watch('url', function(url){
                //controller of the parent (ngSocialite) this is used to share attributes between scopes
                //I am still researching away to do this automatically. meaning, the scope of the transcluded element's parent is used automatically if it's not present
                controller.copy(scope);
            });





        }

    }
    return twitter;
});

socialiteModule.directive('facebook', function() {
    var facebook = {
        restrict: 'E',
        require:"^ngSocialite",
        scope:{
            url:"@url",
            text:"@text",
            lang:"@lang",
            widget :"@widget",
            via : "@via",
            related : "@related",
            count : "@count",
            counturl : "@counturl",
            hashtags : "@hashtags",
            size : "@size",
            dnt : "@dnt"
        },
        replace:true,
        template: "<li>"+
            "<a ng-href={{socialite_url}} class='socialite facebook-like' data-text='{{facebook}}' data-url='{{url}}' data-count='vertical' rel='nofollow' target='_blank'><span wait='{{wait}}' class='vhidden'>Share on Twitter</span></a>"+
            "</li> ",
        link: function(scope, element, attrs,controller) {


//            Socialite.setup({
//                facebook: {
//                    lang     : 'en_GB',
//                    appId    : 123456789,
//                    onlike   : function(url) { /* ... */ },
//                    onunlike : function(url) { /* ... */ },
//                    onsend   : function(url) { /* ... */ }
//                }
//            });


            //ordered as: setting,attribute,description,default
//            action
//            data-action
//            The verb to display on the button. Can be either "like" or "recommend"
//            "like"


//            colorscheme
//            data-colorscheme
//            The color scheme used by the plugin. Can be "light" or "dark".
//            "light"

//            href
//            data-href
//            The absolute URL of the page that will be liked.
//                XFBML and HTML5 versions default to the current URL.


//                kid_directed_site
//            data-kid-directed-site
//            If your web site or online service, or a portion of your service, is directed to children under 13 you must enable this
//            "false"


//            layout
//            data-layout
//            Selects one of the different layouts that are available for the plugin. Can be one of "standard", "button_count", or "box_count". See the FAQ for more details.
//            "standard"

//            ref
//            data-ref
//            A label for tracking referrals which must be less than 50 characters and can contain alphanumeric characters and some punctuation (currently +/=-.:_). See the FAQ for more details.
//                None


//            share
//            data-share
//            Specifies whether to include a share button beside the Like button. This only works with the XFBML version.
//            "false"


//            show_faces
//            data-show-faces
//            Specifies whether to display profile photos below the button (standard layout only). You must not enable this on child-directed sites.
//            "false"


//            width
//            data-width
//            The width of the plugin. The layout you choose affects the minimum and default widths you can use, please see the FAQ below for more details.
//                Depends on layout



            scope.$watch('lang',function(newlang,oldlang){

                controller.copy(scope);

                console.log("I have changed!");

            });

        }
    }
    return facebook;
});
////google plus
//socialiteModule.directive('facebook', function() {

//Socialite.setup({
//    googleplus: {
//        lang               : 'en-GB',
//        onstartinteraction : function(el, e) { /* ... */ },
//        onendinteraction   : function(el, e) { /* ... */ },
//        callback           : function(el, e) { /* ... */ }
//    }
//});


//    var googleplus = {
//        restrict: 'AC',
//        template: "<li>"+
//            "<a ng-href={{socialite_url}} class='socialite facebook-{{widget}}' data-text='{{facebook}}' data-url='http://socialitejs.com' data-count='vertical' rel='nofollow' target='_blank'><span class='vhidden'>Share on Twitter</span></a>"+
//            "</li> ",
//        link: function(scope, element, attrs) {
//
//
//            //list of facebook attributes
//            //facebook:["socialiteText","socialiteLang","socialiteUrl"]
//
//        }
//    }
//    return googleplus;
//});
////linkedIn
//socialiteModule.directive('facebook', function() {
//    var facebook = {
//        restrict: 'AC',
//        template: "<li>"+
//            "<a ng-href={{socialite_url}} class='socialite facebook-{{widget}}' data-text='{{facebook}}' data-url='http://socialitejs.com' data-count='vertical' rel='nofollow' target='_blank'><span class='vhidden'>Share on Twitter</span></a>"+
//            "</li> ",
//        link: function(scope, element, attrs) {
//
//
//            //list of facebook attributes
//            //facebook:["socialiteText","socialiteLang","socialiteUrl"]
//
//        }
//    }
//    return facebook;
//});


/**
 *
 * whenever you have a custom directive in the future, you add the attributes through the service or provider method
 * then you call social commit to your attributes, which will do the checking for you ....
 *
 */




