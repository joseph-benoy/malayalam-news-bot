function getLinks(){
  let response = UrlFetchApp.fetch(`https://www.manoramaonline.com/news/latest-news.html`).getContentText();
  const $  = Cheerio.load(response);
  let links = [];
  $('.subhead-001-ml a').each(function(){
    links.push($(this).attr("href"));
  });
  return links;
}
function sendReply(chatId,data){
  const endPoint = "https://api.telegram.org/bot1879463383:AAGuLxW0ev8wEK2EtD-rYi3BsgAyLg2xEb4/sendMessage";
  const options = {
    method : "post",
    contentType: 'application/json',
    payload:JSON.stringify(data)
  };
  const response = UrlFetchApp.fetch(endPoint,options);
}
function sendChatAction(chatId){
  let data = {
    chat_id:chatId,
    action:'typing'
  };
  const endPoint = "https://api.telegram.org/bot1879463383:AAGuLxW0ev8wEK2EtD-rYi3BsgAyLg2xEb4/sendChatAction";
  const options = {
    method : "post",
    contentType: 'application/json',
    payload:JSON.stringify(data)
  };
  const response = UrlFetchApp.fetch(endPoint,options);
}
function doPost(e){
  const update = JSON.parse(e.postData.contents);
  const messageText = update.message.text;
  const chatId = update.message.chat.id;
  const fullName = update.message.from.first_name+" "+update.message.from.last_name;
  let data = {};
  if(messageText=="/start"){
    let spreadSheet = SpreadsheetApp.openById('1p0wSJ8WuvH5TRoLvzveDoQQyLLLLhBPOsF2k5nGtU70');
    let sheet = spreadSheet.getSheetByName('user_list');
    sheet.appendRow([chatId,fullName,new Date().toLocaleDateString()]);
    sendChatAction(chatId);
    data = {
        text : `*Hello ${fullName}!*\nWe will update you with latest news around the globe in *Malayalam*`,
        parse_mode : "markdown",
        chat_id : chatId,
    };
  }
  sendReply(chatId,data);
}
function getUpdates(){
  let links = getLinks();
  let sheet = SpreadsheetApp.openById('1p0wSJ8WuvH5TRoLvzveDoQQyLLLLhBPOsF2k5nGtU70').getSheetByName('news_cache');
  let linksTosend = [];
  let cache = sheet.getDataRange().getValues();
  let newsCache = []
  for(let i of cache){
    newsCache.push(i[0]);
  }
  //console.log(newsCache)
  for(let link of links){
    if(!newsCache.includes(link)){
      sheet.appendRow([link]);
      linksTosend.push(link);
    }
  }
  let chatIdList = [];
  let sheetUser = SpreadsheetApp.openById('1p0wSJ8WuvH5TRoLvzveDoQQyLLLLhBPOsF2k5nGtU70').getSheetByName('user_list');
  let values = sheetUser.getDataRange().getValues();
  for(i in values){
    chatIdList.push(values[i][0].toString());
  }
  for(link of linksTosend){
    for(id of chatIdList){
        data = {
          text : link,
          parse_mode : "markdown",
          chat_id : id,
        };     
        sendReply(id,data);
    }
  }
}

function clearNewsCache(){
  let sheet = SpreadsheetApp.openById('1p0wSJ8WuvH5TRoLvzveDoQQyLLLLhBPOsF2k5nGtU70').getSheetByName('news_cache');
  sheet.clear();
}