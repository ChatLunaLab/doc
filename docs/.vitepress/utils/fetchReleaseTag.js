export async function fetchReleaseTag() {
    const res = await fetch('https://registry.npmjs.org/koishi-plugin-chatluna');
    const json = await res.json();
    const latestVersion = json['dist-tags']?.latest;
    if (!latestVersion) return;
    const tagLineParagraph = document.querySelector('div.VPHero.VPHomeHero > div > div.main > p.tagline');
    const docsReleaseTagSpan = document.createElement('samp');
    docsReleaseTagSpan.classList.add('docs-chatluna-release-tag');
    docsReleaseTagSpan.innerText = latestVersion;
    tagLineParagraph?.appendChild(docsReleaseTagSpan);
  }