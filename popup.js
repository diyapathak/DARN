var spoilerList;

function saveSpoilerList()
{
  chrome.storage.sync.set({
    'spoilerItem': spoilerList["spoilerItem"]
  }, function (result)
  {
    if(chrome.runtime.error)
    {
      console.log(chrome.runtime.error);
    }
  });
}

function updateListView()
{
  if(spoilerList["spoilerItem"] != null)
  {
    $('#listView').empty();
    var html = '<ul>';
    for(var i = 0; i < spoilerList['spoilerItem'].length; i++)
    {
      html += '<li><a class="spoilerListItem" href="#">' + spoilerList['spoilerItem'][i] + '</a></li>';
    }
    html += '</ul>';
    $('#listView').append(html);
  }
}

function searchForSpoilers()
{
  if (spoilerList["spoilerItem"] != null)
  {
    var searchString = '';
    spoilerList["spoilerItem"].forEach(function (item){
      searchString = searchString + "p:contains('" + item + "'), ";
      console.log(searchString);
    });
    searchString = searchString.substring(0, searchString.length - 2);
    $(searchString).parents('.userContentWrapper').css('-webkit-filter', 'blur(5px)');
  }
}


chrome.storage.sync.get("spoilerItem", function (results)
  {
    spoilerList = results;
    if(spoilerList['spoilerItem'] == null)
    {
      spoilerList =
      {
        'spoilerItem': []
      };
      saveSpoilerList()
    }
  });

  // jquery
  $(function ()
  {
    updateListView();
    searchForSpoilers();

    $('#submit-button').click(function (evt){
      itemToAdd = $('#block-item').val().toLowerCase();
      if(itemToAdd === "")
      {
        alert("That isn't a word! Please enter a new search term.");


      }
      else
      {
        spoilerList['spoilerItem'].push(itemToAdd);
        saveSpoilerList();
        $('#block-item').val('');
        updateListView();
        searchForSpoilers();
      }

    });

    $('clear-button').click(function (evt){
      spoilerList = {
        'spoilerItem': []
      };
      saveSpoilerList();
      $('#block-item').val('');
      updateListView();
      searchForSpoilers();
    });

    $(document).on('click', '.spoilerListItem', function (item){
      $('p:contains(' + item.currentTarget.innerHTML + ')').parents('.userContentWrapper').css('-webkit-filter', '');
      spoilerList["spoilerItem"].splice($.inArray(item.currentTarget.innerHTML, spoilerList["spoilerItem"]), 1);
      saveSpoilerList();
      updateListView();
      searchForSpoilers();
    });

    var observer = new MutationObserver(function (mutations, observer){
      searchForSpoilers();
    });

    observer.observe($('[id^=topnews_main_stream_]').get(0), {
      subtree: true,
      attributes: true
    });

  });
  // end of jquery
