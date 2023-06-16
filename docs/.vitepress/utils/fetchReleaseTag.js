export function fetchReleaseTag() {
    return fetch('https://api.github.com/repos/dingyi222666/koishi-plugin-chathub/releases')
      .then((res) => res.json())
      .then((json) => json?.[0]?.name ?? '')
      .then(releaseTag => {
        if (!releaseTag) return;
        console.log(releaseTag)
        const tagLineParagragh = document.querySelector('div.VPHero.VPHomeHero > div > div.main > p.tagline')
        const docsReleaseTagSpan = document.createElement('samp')
        docsReleaseTagSpan.classList.add('docs-chathub-release-tag')
        docsReleaseTagSpan.innerText = releaseTag
        tagLineParagragh?.appendChild(docsReleaseTagSpan)
      })
  }