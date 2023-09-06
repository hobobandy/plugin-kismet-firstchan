var observer;

$(document).on('jspanelloaded', function (event, id) {
  if (id == "datasources") {
    var targetNode = document.getElementById("datasources");

    const config = { attributes: false, childList: true, subtree: true };

    var callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.target.id == "channels") {
          if ($(this).find("#chanbuttons").length > 0) {

            $("#datasources div.accordion").find("#chanbuttons").each(function (index) {
              if ($(this).find("#first").length == 0) {
                $(this).prepend(
                  $('<button>', {
                    id: "first",
                    uuid: $(this).attr('uuid')
                  }).html("First")
                  .button()
                  .on('click', function(){
                    // Update uuid for the clicked uuid, not whichever was last observed
                    var uuid = $(this).attr('uuid')
                    var chans = [];
                    var chans_items = $('button.chanbutton[uuid=' + uuid + ']');
                    var first_chan;
                    if (chans_items.length > 0) {
                      first_chan = chans_items.first()
                      chans.push(first_chan.attr('channel'));
                    }
                    if (first_chan) {
                      var jscmd = {
                        "cmd": "hop",
                        "channels": chans,
                        "uuid": uuid
                      };
                      var postdata = "json=" + encodeURIComponent(JSON.stringify(jscmd));

                      $.ajax({
                        url: `${local_uri_prefix}datasource/by-uuid/${uuid}/set_channel.cmd`, 
                        method: 'POST',
                        data: postdata,
                        dataType: 'json',
                        success: function(data) { },
                        timeout: 30000,
                      });

                      // console.log(postdata);

                      $('button.chanbutton[uuid=' + uuid + ']').each(function(i){
                        $(this).removeClass('disable-chan-system');
                        $(this).removeClass('enable-chan-system');
                        $(this).addClass('disable-chan-user');
                        $(this).removeClass('enable-chan-user');
                      })
                      
                      first_chan.removeClass('disable-chan-system');
                      first_chan.removeClass('enable-chan-system');
                      first_chan.removeClass('disable-chan-user');
                      first_chan.addClass('enable-chan-user');
                    }
                  })
                );
              }
            });
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // console.log("Started observing data sources.");
  }
});

$(document).on('jspanelclosed', function (event, id) {
  if (id == "datasources") {
    observer.disconnect();
    // console.log("Stopped observing data sources.");
  }
});