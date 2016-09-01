$( document ).ready(function(){
  var listo = [];

  $('#newTaskForm').hide();

  //task constructor that takes in the new task and wraps it in an object
  var Task = function( task ) {
    this.task = task;
    this.id = 'new';
  };

  var addTask = function( task ) {
    //prevents blank tasks from being created
    if( task ) {
      // pass new task into Task constructor and pushes it to 'listo' array
      task = new Task( task );
      listo.push( task );

      $('#newItemInput').val('');

      //adds new item to the list in index.html
      $('#newList').append(
              '<a href="#finish" class="" id="item">' +
              '<li class="list-group-item">' +
              '<h3>' + task.task + '</h3>' +
              '<span class="arrow pull-right">' + '<i class="glyphicon glyphicon-arrow-right">' + '</span>' +
              '</li>' +
              '</a>'
      );
    }
    $('#newTaskForm').slideToggle('fast', 'linear');
  };

  var advanceTask = function( task ) {
    var modified = task.innerText.trim();
    for ( var i = 0; i < listo.length; i++ ) {
      if ( listo[ i ].task === modified ) {
        if ( listo[ i ].id === 'new' ) {
          listo[ i ].id === 'inProgress';
        }
        else if ( listo[ i ].id === 'inProgress') {
          listo[ i ].id = 'archived';
        }
        else {
          listo.splice( i, 1 );
        }
        break;
      }
    }
    task.remove();
  };

  //when click the 'saveNewItem' button, call the addTask function
  $('#saveNewItem').on('click', function( e ) {
    e.preventDefault();
    var task = $('#newItemInput').val().trim();
    addTask( task );
  });

  //opens form
  $('#add-todo').on('click', function(){
    $('#newTaskForm').fadeToggle('fast', 'linear');
  });

  //closes form
  $('#cancel').on('click', function( e ) {
    e.preventDefault();
    $('#newTaskForm').fadeToggle('fast', 'linear');
  });

  //moves task to 'In Progress'
  $( document ).on( 'click', '#item', function( e ) {
    e.preventDefault();
    var task = this;
    advanceTask(task);
    this.id = 'inProgress';
    $( '#currentList' ).append( this.outerHTML );
  } );

  //moves task from 'inProgress' to 'archived'
  $( document ).on( 'click', '#inProgress', function ( e ) {
    e.preventDefault();
    var task = this;
    task.id = 'archived';
    var changeIcon = task.outerHTML.replace( 'glyphicon-arrow-right, glyphicon-remove' );
    advanceTask(task);
    $( '#archivedList' ).append( changeIcon );
  });

  $( document ).on( 'click', '#archived', function ( e ) {
    e.preventDefault();
    var task = this;
    advanceTask( task );
  });

});