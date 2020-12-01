const files = dir => new Promise(
    res => dir.createReader().readEntries(
        entries => Promise.all(
            entries.filter(e => e.name[0] !== '.')
                    .map(e => e.isDirectory ? files(e) : new Promise(res => e.file(res)))
        ).then(_files => [..._files])
        .then(res)
    )
);

const timestamp = dir => files(dir)
    .then(_files => _files.map(f => f.name + f.lastModifiedDate).join());

const reload = () => chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
    chrome.runtime.reload();
});

const watch = (dir, lastTime) => 
    timestamp(dir)
        .then(time => {
            if (!lastTime || (lastTime === time)) setTimeout(() => watch(dir, time), 1000);
            else reload();
        });

chrome.management.getSelf(self => {
    if (self.installType === 'development') {
        chrome.runtime.getPackageDirectoryEntry(dir => watch(dir));
    }
})