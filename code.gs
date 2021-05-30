function getLinks(){
  let response = UrlFetchApp.fetch("https://www.manoramaonline.com/news/latest-news.html").getContentText();
  const $  = Cheerio.load(response);
  let links = [];
  $('.subhead-001-ml a').each(function(){
    links.push({link:$(this).attr("href"),title:$(this).attr("title")});
  });
  Logger.log(links);
}
function doPost(e){
  let update = JSON.parse(e.parameters.contents);
  let chatId = update.message.chat.id;
  let messageText = update.message.text;
}