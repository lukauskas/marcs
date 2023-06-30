import env from 'zrender/lib/core/env';
import { isFunction } from 'zrender/lib/core/util';
import confirmLicense from 'components/controls/AcceptLicenseModal'

/* 
This is a reimplementation of 

https://github.com/apache/echarts/blob/dfa1f0732972e358a3711c75b5f41db741e986b6/src/component/toolbox/feature/SaveAsImage.ts

as a function so that we can use it within our "custom" save as dialog, which allows for checking of license before download.

Originally licensed as Apache License, Version 2.0
*/
function saveVisAsImage(api, filename='marcs-image', pixelRatio=4) { 
    
    const title = filename;
    const isSvg = api.getZr().painter.getType() === 'svg';
    const type = isSvg ? 'svg' : 'png';

    const url = api.getConnectedDataURL({
        type: type,
        pixelRatio,
        backgroundColor: '#ffffff',
    });

    const browser = env.browser;

    // Chrome, Firefox, New Edge
    if (isFunction(MouseEvent) && (browser.newEdge || (!browser.ie && !browser.edge))) {
        const $a = document.createElement('a');
        $a.download = title + '.' + type;
        $a.target = '_blank';
        $a.href = url;
        const evt = new MouseEvent('click', {
            // some micro front-end framework， window maybe is a Proxy
            view: document.defaultView,
            bubbles: true,
            cancelable: false
        });
        $a.dispatchEvent(evt);
    }
    // IE or old Edge
    else {
        // @ts-ignore
        if (window.navigator.msSaveOrOpenBlob || isSvg) {
            const parts = url.split(',');
            // data:[<mime type>][;charset=<charset>][;base64],<encoded data>
            const base64Encoded = parts[0].indexOf('base64') > -1;
            let bstr = isSvg
                // should decode the svg data uri first
                ? decodeURIComponent(parts[1])
                : parts[1];
            // only `atob` when the data uri is encoded with base64
            // otherwise, like `svg` data uri exported by zrender,
            // there will be an error, for it's not encoded with base64.
            // (just a url-encoded string through `encodeURIComponent`)
            base64Encoded && (bstr = window.atob(bstr));
            const filename = title + '.' + type;
            // @ts-ignore
            if (window.navigator.msSaveOrOpenBlob) {
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr]);// @ts-ignore
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else {
                const frame = document.createElement('iframe');
                document.body.appendChild(frame);
                const cw = frame.contentWindow;
                const doc = cw.document;
                doc.open('image/svg+xml', 'replace');
                doc.write(bstr);
                doc.close();
                cw.focus();
                doc.execCommand('SaveAs', true, filename);
                document.body.removeChild(frame);
            }
        }
        else {
            const html = ''
                + '<body style="margin:0;">'
                + '<img src="' + url + '" style="max-width:100%;" title="" />'
                + '</body>';
            const tab = window.open();
            tab.document.write(html);
            tab.document.title = title;
        }
    }
}

export default function confirmLicenseAndSaveAsImageTool(getApi, trackEvent, filename="marcs-image") {
    return ({
        show: true,
        title: 'PNG',
        // Same as "save icon" https://github.com/apache/echarts/blob/dfa1f0732972e358a3711c75b5f41db741e986b6/src/component/toolbox/feature/SaveAsImage.ts#L133
        icon: 'path://M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
        onclick: async () => {
            if (await confirmLicense(trackEvent)) {
                console.log('The user has accepted the license, starting download');
                saveVisAsImage(getApi(), filename);
            } else {
                console.log('The user has declined the license, download not permitted');
            }
        },
    });
}