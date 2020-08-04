(() =>
{
  let all_data = []
  const xhrOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      if ( this.responseURL.indexOf('Followers') < 0 )
        return

      let data = []

      try {
        data = JSON.parse(this.responseText)
        data = data.data.user.followers_timeline.timeline.instructions
          .filter(i => 'TimelineAddEntries' == i.type).shift().entries
      } catch(e) {}

      all_data = all_data.concat(data)
          console.log(all_data)
    })
    return xhrOpen.apply(this, arguments)
  }

  setInterval(() =>
  {
    if ( location.pathname.indexOf('/followers') <= 0 )
      return

    const nodes = document.querySelectorAll('[aria-label="Timeline: Followers"] div[data-testid="UserCell"] img[src*=profile_images]:not(.xtfcproc)')
        , processNode = (node) =>
        {
          const link = node.closest('a[href^="/"]')

          if ( ! link || ! link.href )
            return

          const handle = link.href.split('/').filter(Boolean).pop()

          if ( ! handle )
            return

          let user = all_data.filter(Boolean)
            .find(x => x.content && x.content.itemContent && handle.toLowerCase() == x.content.itemContent.user.legacy.screen_name.toLowerCase())
          user && ( user = user.content.itemContent.user.legacy )

          if ( ! user || ! user.screen_name )
            return

          const container = node.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.children[0]
              , status_tag = document.createElement('div')
              , theme_color = (document.head.querySelector('meta[name="theme-color"]') || {}).content || ''

          status_tag.textContent = user.followers_count + ' follower' + ( 1 !== user.followers_count ? 's' : '' )
          status_tag.style.color = -1 == theme_color.toLowerCase().indexOf('fff') ? '#fff' : '#000'
          status_tag.style.marginLeft = 'auto'
          status_tag.style.fontWeight = 'bold'
          status_tag.className = 'css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0 xtfcstat'
          container.querySelectorAll('.xtfcstat').forEach(node => node.remove())
          container.insertBefore(status_tag, container.lastElementChild)
        }

    nodes.forEach(node =>
    {
      node.classList.add('xtfcproc')

      console.log(node)

      try {
        processNode(node)
      } catch(e) {
        console.log('[TWITTER FOLLOWERS COUNT]', e)
      }
    })
  }, 100)
})()