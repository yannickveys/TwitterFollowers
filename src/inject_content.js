(() =>
{
  const script = document.createElement('script')
  script.src = chrome.extension.getURL('src/content.js')
  script.type = 'text/javascript'
  document.body.appendChild(script)
})()