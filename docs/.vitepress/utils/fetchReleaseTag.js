export async function fetchReleaseTag() {
    const res = await fetch('https://api.github.com/repos/ChatLunaLab/chatluna/releases');
    const json = await res.json();
    const releaseTag = json?.[0]?.name ?? '';
    if (!releaseTag) return;
    console.log(releaseTag);
    const tagLineParagragh = document.querySelector('div.VPHero.VPHomeHero > div > div.main > p.tagline');
    const docsReleaseTagSpan = document.createElement('samp');
    docsReleaseTagSpan.classList.add('docs-chathub-release-tag');
    docsReleaseTagSpan.innerText = releaseTag;
    tagLineParagragh?.appendChild(docsReleaseTagSpan);
  }