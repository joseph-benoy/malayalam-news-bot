function getLinks(){
  let response = UrlFetchApp.fetch("https://www.manoramaonline.com/news/latest-news.html").getContentText();
  const $  = Cheerio.load(response);
  let links = [];
  $('.subhead-001-ml a').each(function(){
    links.push({link:$(this).attr("href"),title:$(this).attr("title")});
  });
  Logger.log(links);
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
        sendChatAction(chatId);
        let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [['Top news'],['Kerala'],['India'],['World'],['Business'],['Sports'],['Finance'],['Auto']]
        };
        data = {
        text : `*Hello ${fullName}!*\nWe will update you with latest news around the globe in *Malayalam*`,
        parse_mode : "markdown",
        chat_id : chatId,
        reply_markup : btnMarkup
    };
  }
  if(messageText=="Top news"){

  }














































  
  sendReply(chatId,data);
}