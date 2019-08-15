'use strict';

/*

   This piece uses jQuery and the Pages variable (defined in app.html) to
   create the navigation links (list items) in the page header, with the
   needed angular directives in them. The directives are to make the right 
   link highlighted at each route.

*/

/* global $ */
/* global Pages */


$(function(){

    // Create a navigation item (a link) for each page.
    for ( var path in navPages ) {
      var title = navPages[path][1];

      /*
       * HTML to be created:
<li ng-class="{active: (locationPath=='/about')}"><a href="#/about">About</a></li>
      */

      $('.header ul.nav').append(
        '<li ' +
        'ng-class="{active: (locationPath==\'' + path + '\')}">' +
        '<a href="#' + path + '">' +
        title +
        '</a>' +
        '</li>');

      if (path=="/") {
          if (userMeta.Organisation.selectionDone) {
              $('.header ul.nav').append(
                  '<li ' +
                  'ng-class="{active: (locationPath==\'' + '/migrateToS3' + '\')}">' +
                  '<a href="#' + '/migrateToS3' + '">' +
                  'Migrate To S3' +
                  '</a>' +
                  '</li>');
          }
          if (userMeta.user.role=="admin") {
              $('.header ul.nav').append(
                  '<li ' +
                  'ng-class="{active: (locationPath==\'' + '/users' + '\')}">' +
                  '<a href="#' + '/users' + '">' +
                  'User Management' +
                  '</a>' +
                  '</li>');
          }
      }

    }

  });
