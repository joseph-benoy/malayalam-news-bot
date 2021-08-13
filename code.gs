function getLinks(){
  let response = UrlFetchApp.fetch(`https://www.manoramaonline.com/news/latest-news.html`).getContentText();
  const $  = Cheerio.load(response);
  let links = [];
  $('.subhead-001-ml a').each(function(){
    links.push({link:$(this).attr("href"),title:$(this).attr("title")});
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
  let values = sheet.getDataRange().getValues();
  const rowCount = sheet.getMaxRows();
  let urlList = [];
  for(let i=0;i<links.length;i++){
    urlList.push(links[i].link);
  }
  let list = [];
  for(let i=0;i<values.length;i++){
    if(urlList.includes(values[i][0])){
      list.push(values[i][0]);
    }
  }
  for(let i=0;i<urlList.length;i++){
    if(!list.includes(urlList[i])){
      list.push(urlList[i]);
      linksTosend.push(urlList[i]);
    }
  }
  sheet.clear();
  for(let i=0;i<list.length;i++){
    sheet.appendRow([list[i]]);
  }
  let chatIdList = [];
  if(linksTosend.length!=0){
    let sheet = SpreadsheetApp.openById('1p0wSJ8WuvH5TRoLvzveDoQQyLLLLhBPOsF2k5nGtU70').getSheetByName('user_list');
    let values = sheet.getDataRange().getValues();
    for(i in values){
      chatIdList.push(values[i][0].toString());
    }
  }
  for(i in linksTosend){
    const content = getContent(linksTosend[i]);
    for(i in chatIdList){
      sendChatAction(chatIdList[i]);
        data = {
          text : content,
          parse_mode : "markdown",
          chat_id : chatIdList[i],
        };     
        sendReply(chatIdList[i],data);
    }
  }
}
function getContent(url){
  let response = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(response);
  let p = $(".article p").text();
  p = p.replace(p.slice(p.indexOf('English Summary')),'');
  h = $(".story-headline").text();
  let imgUrl = $(".story-figure-image img").attr("src");
  let telegraphUrl = `https://api.telegra.ph/createPage`;
  let data = {
    access_token : `4e09e0cb375626fd57c89d7d7e70855c4957a2329d736e4bfe544a52f757`,
    title : h,
    author_name : `Barbarian Developer`,
    content : [{"tag":"figure","children":[{"tag":"img","attrs":{"src":`${imgUrl.replace("/","\/")}`}}]},{'tag':'p','children':[`${p}`]}],
  };
  let options = {
    method : "post",
    contentType: 'application/json',
    payload:JSON.stringify(data)
  };
  let telegraphResponse = UrlFetchApp.fetch(telegraphUrl,options).getContentText();
  return (JSON.parse(telegraphResponse).result.url).replace("\\","");
}