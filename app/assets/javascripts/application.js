// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require jquery.ui.all
//= require bootstrap
//= require turbolinks
//= require_tree .

$(function() {

  var $new_task_name = $("#new_task_name");
  var $new_task_start_date = $('#new_task_start_date');
  var $modal_close = $("#modal-close");
  var $today = $new_task_start_date.val();
  var $new_task_modal = $('#new-task-modal');
  var $modal_save = $("#modal-save");

  function querystring(key) {
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
   return r;
  }

  function parseDay(obj) {
    var day = obj.split('-');
    // JS and Rails are using different bases for months
    day = new Date(day[0], day[1] - 1, day[2]);
    day = day.getDay();
    // JS uses 0 as sunday, replace to make it end of week
    if (day === 0)
      day = 7;
    return day;
  }

  $('input[datepicker]').datepicker({
    dateFormat: 'yy-mm-dd',
    showOtherMonths: true,
    selectOtherMonths: true,
    firstDay: 1,
  });

  $('#tbody').on('click', 'a.del-task', function(e) {
    e.preventDefault();
    var $task = $(this);
    $.ajax({
      url: $task.attr('href').replace('remove', ''),
      dataType: 'json',
      type: 'DELETE',
      success: function(data, textStatus, xhr) {
          $task.parent().parent().hide("highlight", function() {
          $(this).remove();
        });
      }
    });
  });

  $('#tbody').on('click', '.cell_tog', function(e) {
    e.preventDefault();
    var $cell = $(this);

    if($(this).hasClass('error'))
    {
      var date = $(this).children('a').attr('href');
      date = date.substring(date.indexOf('date=') + 5);

      var url = $(this).children('a').attr('href');
      url = url.substring(0, url.indexOf('new'));

      $.ajax({
        url: url,
        type: 'POST',
        data: { task_date: date },
        dataType: 'json',
        success: function(data, textStatus, xhr) {
          $cell.removeClass('error');
          $cell.addClass('success');
          $cell.children('a').text('Set Incomplete');
          $cell.children('a').attr('href', data['destroy_url']);
        }
      });
    }
    else
    {
      $.ajax({
        url: $(this).children('a').attr('href').replace('remove', ''),
        type: 'DELETE',
        dataType: 'json',
        success: function(data, textStatus, xhr) {
          $cell.removeClass('success');
          $cell.addClass('error');
          $cell.children('a').text('Set Complete');
          $cell.children('a').attr('href', data['create_url']);
        }
      });
    }
  });

  $('#tbody').on('click', '.cell_descriptor', function(e) {
    e.preventDefault();
  });

  function toggle_cell(e, obj, create) {
    e.preventDefault();
    if (create)
    {

      $(this).removeClass('success');
      $(this).addClass('error');
      $(this).children($('.cell_descriptor')).html('Set Complete');
    }
    else
    {
      $(this).removeClass('error');
      $(this).addClass('success');
      $(this).children($('.cell_descriptor')).html('Set Incomplete');
    }
  }

  $('#add-new-task').click(function(e) {
    e.preventDefault();
    $new_task_modal.modal('show');
  });

  $($new_task_modal).on('shown', function() {
    $new_task_name.focus();
  });

  $modal_close.click(function(e) {
    e.preventDefault();
    $new_task_name.val('');
    $new_task_start_date.val($today);
    $new_task_modal.modal('hide');
  });

  $modal_save.click(function(e) {
    e.preventDefault();

    $.ajax({
      url: $modal_save.attr('href'),
      type: 'POST',
      data: $('#modal-form').serialize(),
      dataType: "json",
      cache: false,
      success: function(data, textStatus, xhr) {
        $new_task_name.val('');
        $new_task_start_date.val($today);
        $new_task_modal.modal('hide');

        var task_date = parseDay(data['task'].start_date);
        var today_int = parseDay($today);
        var cell;

        for(var i = 1; i < 8; i++)
        {
          if (task_date > i)
            cell += "<td></td>";
          else if (i > today_int)
            cell += "<td class='pending'></td>";
          else
            cell += "<td class='error'></td>";
        }

        $('#tbody').append(
          "<tr>" +
            "<td class='task-name'>" +
              "<a href='tasks/" + data['task'].id + "/remove'" +
                "title='Delete Task' class='del-task'>X</a> | " +
              "<a href='' title='Edit Task'>" + data['task'].name + "</a>" +
            "</td>" +
            cell +
          "</tr>"
        );
      }
    });
  });

  $('.anon_toggle').click(function() {
    if ($(this).hasClass('success'))
    {
      $(this).removeClass('success');
      $(this).addClass('error');
      $(this).children($('.cell_descriptor')).html('Set Complete');
    }
    else
    {
      $(this).removeClass('error');
      $(this).addClass('success');
      $(this).children($('.cell_descriptor')).html('Set Incomplete');
    }
  });

});

/*=========== Add New Task Modal ============================*/
/*
  $new_task_name.blur(function()
  {
    checkToDisableSubmit();
  });

  $new_task_start_date.blur(function()
  {
    checkToDisableSubmit();
  });

  $modal_close.click(function(e) {
    $new_task_name.val('');
    $new_task_start_date.val($today);
    $('#new-task-modal').modal('hide');
    e.preventDefault();
  });

  $modal_save.click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled'))
    {
      $('#modal-form').submit();
      // $.ajax({
      //   url: "tasks/new",
      //   type: 'POST',
      //   data: { name: $new_task_name.val(), start_date: $new_task_start_date.val() },
      //   dataType: "json",
      //   cache: false,
      //   success: function(data, textStatus, xhr) {
      //     alert('success');
      //   }
      // });
    }
  });

  var checkToDisableSubmit = function()
  {
    if(safeToSubmit())
      $modal_save.removeClass('disabled');
    else
      $modal_save.addClass('disabled');
  };

  var safeToSubmit = function()
  {
    return ($new_task_name.val() !== '' && $new_task_start_date.val() !== '');
  };
/*=========== END Add New Task Modal ============================*/

/*=========== Cell Data ======================================*/

/*=========== END Cell Data ==================================*/

// });