$( document ).ready(function(){
  var listo = [];

  $('#newTaskForm').hide();

  grabDataFromLocalStorage();

  function grabDataFromLocalStorage() {
    // if localStorage is not empty, parse it and store in listo.
    if ( typeof localStorage[ 'todoData' ] !== 'undefined' && localStorage[ 'todoData' ] !== '' ) {
      listo = JSON.parse( localStorage[ 'todoData' ] );
      repopulateToDos( listo );
    }
    // if localStorage is empty, set listo to equal []
    else {
      listo = [];
    }
  };

  function repopulateToDos( arr ) {
    // take what exists in listo now and add it back to the HTML
    for ( var i = 0; i < arr.length; i++ ) {
        var currentTaskName = arr[ i ][ 'task' ];
        var list;
        if ( arr[ i ].id === 'new' ) {
          list = 'newList'
        }
        else if ( arr[ i ].id === 'inProgress') {
          list = 'currentList';
        }
        else {
          list = 'archivedList';
        }
        $('#' + list ).append(
                '<a href="#finish" class="" id="item">' +
                '<li class="list-group-item">' +
                '<h3>' + currentTaskName + '</h3>' +
                '<span class="arrow pull-right">' + '<i class="glyphicon glyphicon-arrow-right">' + '</span>' +
                '</li>' +
                '</a>'
        );
      }
    };


  var generateId = function() {
    var currentId = 0;
    return function() {
      currentId += 1;
      return currentId;
    }
  }

  var idMaker = generateId();

  //task constructor that takes in the new task and wraps it in an object
  var Task = function( task ) {
    this.task = task;
    this.id = 'new';
    this.index = idMaker();
  };

  var addTask = function( task ) {
    //prevents blank tasks from being created
    if( task ) {
      // pass new task into Task constructor and pushes it to 'listo' array
      task = new Task( task );
      listo.push( task );
      localStorage[ 'todoData' ] = JSON.stringify( listo );

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
      if ( listo[ i ][ 'task' ].toUpperCase() === modified ) {
        if ( listo[ i ].id === 'new' ) {
          listo[ i ].id = 'inProgress';
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
    localStorage[ 'todoData' ] = JSON.stringify( listo );
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
    // debugger;
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

  $( document ).on( 'click', '#clear-to-dos', function( e ){
    e.preventDefault();
    localStorage[ 'todoData' ] = '';
    $('#newList, #currentList, #archivedList').empty();
  });

});
