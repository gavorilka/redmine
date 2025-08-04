/* eslint-disable no-useless-escape */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// import {uploadBlob} from '../../../../public/javascripts/attachments.js';

var SVG_VALID = '<span id="valid_svg" style="display: none;" onclick="updateIssue();"><svg style="width: 20px; height: 20px; fill:#27ae60;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z" class="svg_check"/></g></svg></span>';
var SVG_CANCEL = '<span id="refuse_svg" style="display: none;" onclick="refuseEdit();"><svg style="width: 20px; height: 20px; fill: #c0392b;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M14.8,12l3.6-3.6c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0L12,9.2L8.4,5.6c-0.8-0.8-2-0.8-2.8,0   c-0.8,0.8-0.8,2,0,2.8L9.2,12l-3.6,3.6c-0.8,0.8-0.8,2,0,2.8C6,18.8,6.5,19,7,19s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6   C16,18.8,16.5,19,17,19s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8L14.8,12z" class="svg_cancel"/></g></svg></span>';
var insrtedImages = [];
var attachmentId = 1;
var uploadUrl = '/uploads.js';
var issueUrl = window.location.origin;
var currentURL = window.location.href;
var issueId = new URL(currentURL).pathname.match(/\/issues\/(\d+)/)[1];
var attachmentTokens = [];

$(document).ready(function () {
    function replaceImagesInText(issueId, textData) {
        textData = textData.replace(/<img[^>]+src="([^">]+)"[^>]*>/g, '$1');
        const imageFileRegex = /(?:\b)([^\s<>"']+?\.(?:png|jpeg|jpg))(?:\b)/gi;
        let imageReplacements = textData.match(imageFileRegex) || [];
        let replacementPromises = imageReplacements.map((imageName) => {
            return new Promise((resolve) => {
                $.ajax({
                    url: `${issueUrl}/issue_images?key=${api_key}`,
                    method: 'GET',
                    data: {
                        issueId: issueId,
                        imageName: imageName
                    },
                    success: function(response) {
                        const filename = response.attachment.filename;
                        resolve({
                            imageName: imageName,
                            imgTag: filename
                        });
                    },
                    error: function(err) {
                        console.error('Error fetching attachment data:', err);
                        resolve({
                            imageName: imageName,
                            imgTag: imageName
                        });
                    }
                });
            });
        });
        return Promise.all(replacementPromises).then((resolvedImages) => {
            resolvedImages.forEach(({ imageName, imgTag }) => {
                textData = textData.replace(new RegExp(imageName, 'g'), imgTag);
            });
            return textData;
        });
    }    
    function replaceImagesWithAjax(issueId, issueDescriptionData) {
        issueDescriptionData = issueDescriptionData.replace(/<img[^>]+src="([^">]+)"[^>]*>/g, '$1');  
        const imageFileRegex = /(?:\b)([^\s<>"']+?\.(?:png|jpeg|jpg))(?:\b)/gi;
        let imageReplacements = issueDescriptionData.match(imageFileRegex) || [];
        let replacementPromises = imageReplacements.map((imageName) => {
            return new Promise((resolve) => {
                $.ajax({
                    url: `${issueUrl}/issue_images?key=${api_key}`,
                    method: 'GET',
                    data: {
                        issueId: issueId,
                        imageName: imageName
                    },
                    success: function(response) {
                        const attachmentId = response.attachment.id; 
                        const filename = response.attachment.filename;  
                        const imagePath = `/attachments/download/${attachmentId}/${filename}`;
                        // console.log(imagePath);
                        const imgTag = `<img src="${imagePath}" alt="Image" loading="lazy" />`;
                        resolve({
                            imageName: imageName,
                            imgTag: imgTag
                        });
                    },
                    error: function(err) {
                        console.error('Error fetching attachment ID:', err);
                        resolve({
                            imageName: imageName,
                            imgTag: imageName 
                        });
                    }
                });
            });
        });
        Promise.all(replacementPromises).then((resolvedImages) => {
            resolvedImages.forEach(({ imageName, imgTag }) => {
                issueDescriptionData = issueDescriptionData.replace(new RegExp(imageName, 'g'), imgTag);
            });
            $("div.description > div.wiki").html(issueDescriptionData);
        });
    }    
    var description = document.getElementsByClassName('description');
    var textareaDiv = document.createElement('div');
    var innerDiv = document.createElement('div');
    innerDiv.id = "description_textarea";
    innerDiv.style = "display: none;"
    textareaDiv.id = "description__edit";
    innerDiv.appendChild(textareaDiv);
    if(issueDescriptionData && text_format != 'textile'){
        issueDescriptionData=replaceUrlWithAnchor(issueDescriptionData)
        issueDescriptionData=textile.convert(issueDescriptionData);
        issueDescriptionData=convertMarkdownToPre(issueDescriptionData);
        issueDescriptionData=issueDescriptionData.replace(/&lt;pre&gt;/g, '<pre>').replace(/&lt;\/pre&gt;/g, '</pre>')
        replaceImagesWithAjax(issueId, issueDescriptionData);
    }else{
        issueDescriptionData=convertMarkdownToPre(issueDescriptionData);
        issueDescriptionData=replaceUrlWithAnchor(issueDescriptionData);
        issueDescriptionData=textile.convert(issueDescriptionData);
        issueDescriptionData=issueDescriptionData.replace(/&lt;pre&gt;/g, '<pre>').replace(/&lt;\/pre&gt;/g, '</pre>')
        replaceImagesWithAjax(issueId, issueDescriptionData);
    }
    if (description.length > 0) {
        $('#fakeDynamicForm .description').append(innerDiv);
        $('#fakeDynamicForm .description ').append(SVG_VALID);
        $('#fakeDynamicForm .description').append(SVG_CANCEL);
        quill = new Quill('#description__edit', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['blockquote', 'code-block'],
                    [{ 'header': [1, 2, 3, 4, 5, 6] }],
                    ['clean']
                ],
                table: false,
            },
            theme: 'snow',
            placeholder: 'Enter text here...',
            height: 200,
            readOnly: false,
            formats: [
                'bold', 'italic', 'underline', 'strike',
                'list', 'bullet', 'link', 'image', 'video',
                'blockquote', 'code-block', 'header'
            ],

        });
        quill.getModule('toolbar').addHandler('image', function () {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.addEventListener('change', function () {
                var file = input.files[0];
                if (file) {
                    var imageName = file.name;
                    var selection = quill.getSelection();
                    insrtedImages.push(file);
                    quill.insertText(selection ? selection.index : quill.getLength(), '\n' + imageName);
                    quill.setSelection(quill.getLength());
                }
            });
            input.click();
        });

        quill.root.addEventListener('paste', function (event) {
            var clipboardData = event.clipboardData || window.clipboardData;
            if (clipboardData && clipboardData.items) {
                for (var i = 0; i < clipboardData.items.length; i++) {
                    var item = clipboardData.items[i];
                    if (item.type.indexOf('image') !== -1) {
                        var file = item.getAsFile();
                        var fileExtension = file.name.split('.').pop(); 
                        var uniqueName = `image-${Date.now()}.${fileExtension}`; 
                        var renamedFile = new File([file], uniqueName, { type: file.type });
                        var selection = quill.getSelection();
                        insrtedImages.push(renamedFile);
                        quill.insertText(selection ? selection.index : quill.getLength(), '\n' + uniqueName);
                        quill.setSelection(quill.getLength());
                        
                        event.preventDefault();
                        break;
                    }
                }
            }
        });        
        var cleanedDescription = issueDescriptionData.replace(/&para;/g, '');
        var editorText = ins_to_underline(issueDescriptionData);
        editorText = del_to_strike(editorText);
        replaceImagesInText(issueId, editorText).then((updatedEditorText) => {
            quill.clipboard.dangerouslyPasteHTML(updatedEditorText);
        });
    }
    $('.description .iconEdit').on('click', function () {
        $('.description .iconEdit').css("display", "none");
        $('.description .wiki').css("display", "none");
        var validSVG = document.getElementById('valid_svg');
        var refuseSGV = document.getElementById('refuse_svg');
        innerDiv.style = "display: block;";
        validSVG.style = "display: inline-block;";
        refuseSGV.style = "display: inline-block;";
    })

    // tooltip for quill formats
    var boldButton = document.querySelector('.ql-bold');
    if (boldButton) {
        boldButton.setAttribute('title', 'Bold');
    }

    var italicButton = document.querySelector('.ql-italic');
    if (italicButton) {
        italicButton.setAttribute('title', 'Italic');
    }

    var underlineButton = document.querySelector('.ql-underline');
    if (underlineButton) {
        underlineButton.setAttribute('title', 'Underline');
    }

    var strikeButton = document.querySelector('.ql-strike');
    if (strikeButton) {
        strikeButton.setAttribute('title', 'Strike');
    }

    var orderedListButton = document.querySelector('.ql-list[value="ordered"]');
    if (orderedListButton) {
        orderedListButton.setAttribute('title', 'Ordered List');
    }

    var bulletListButton = document.querySelector('.ql-list[value="bullet"]');
    if (bulletListButton) {
        bulletListButton.setAttribute('title', 'Bullet List');
    }

    var linkButton = document.querySelector('.ql-link');
    if (linkButton) {
        linkButton.setAttribute('title', 'Link');
    }

    var imageButton = document.querySelector('.ql-image');
    if (imageButton) {
        imageButton.setAttribute('title', 'Image');
    }

    var cleanButton = document.querySelector('.ql-video');
    if (cleanButton) {
        cleanButton.setAttribute('title', 'Video');
    }

    var blockquoteButton = document.querySelector('.ql-blockquote');
    if (blockquoteButton) {
        blockquoteButton.setAttribute('title', 'Blockquote');
    }

    var codeBlockButton = document.querySelector('.ql-code-block');
    if (codeBlockButton) {
        codeBlockButton.setAttribute('title', 'Code Block');
    }

    var headerButton = document.querySelector('.ql-header');
    if (headerButton) {
        headerButton.setAttribute('title', 'Header');
    }

    var cleanButton = document.querySelector('.ql-clean');
    if (cleanButton) {
        cleanButton.setAttribute('title', 'Clean');
    }

});

function refuseEdit() {
    var textarea = document.getElementById('description_textarea');
    var validSVG = document.getElementById('valid_svg');
    var refuseSGV = document.getElementById('refuse_svg');
    $('.description .wiki').css("display", "block");
    $('.description .iconEdit').css("display", "inline-block");
    textarea.style = "display: none;";
    validSVG.style = "display: none;";
    refuseSGV.style = "display: none";
}

function updateIssue() {
    var descriptionContent = quill.root.innerHTML;
    var descriptionContent1 = underline_convert(descriptionContent);
    var descriptionContent2 = strikethrough_convet(descriptionContent1);
    var descriptionContent3 = bold_convert(descriptionContent2);
    var convertedDescriptionContent = removeStyle(descriptionContent3);
    convertedDescriptionContent=convertPreToMarkdown(convertedDescriptionContent)
    var textileContent = toTextile(convertedDescriptionContent);
    textileContent = textileContent.replace(/<img[^>]+src="([^">]+)"[^>]*>/g, '$1');
    var uploadPromises = insrtedImages.map(handleFileUpload);
    Promise.all(uploadPromises)
        .then(tokens => {
            $.ajax({
                type: "PUT",
                url: `${issueUrl}/issues/${issueId}.json?key=${api_key}`,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    issue: {
                        uploads: tokens.map(token => ({ token: token })),
                        description: textileContent
                    },
                }),
                success: function () {
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    console.error("Error updating issue:", error);
                }
            });
        })
        .catch(error => {
            console.error("Error uploading files:", error);
        });
}
function handleFileUpload(file) {
    var fileSpan = $('<span>', { id: 'attachments_' + attachmentId });
    var progressSpan = $('<div>').insertAfter(fileSpan.find('input.filename'));
    return new Promise((resolve, reject) => {
        var apiResponse = uploadBlob(file, uploadUrl, attachmentId, {
            loadstartEventHandler: onLoadstart.bind(progressSpan),
            progressEventHandler: onProgress.bind(progressSpan)
        });

        apiResponse.then(response => {
            var tokenRegex = /input\.token'\)\.val\('([^']+)'\)/;
            var match = response.match(tokenRegex);

            if (match && match.length > 1) {
                var token = match[1];
                attachmentTokens.push(token);
                resolve(token);
            } else {
                reject("Token not found in the response.");
            }
        })
        // .catch(error => {
        //     reject("Error occurred during file upload: " + error);
        // });
    });
}

function onLoadstart(e) {
    var fileSpan = $('<span>', { id: 'attachments_' + attachmentId });
    fileSpan.removeClass('ajax-waiting');
    fileSpan.addClass('ajax-loading');
    $('input:submit', $(this).parents('form')).attr('disabled', 'disabled');
}

function onProgress(e) {
    if (e.lengthComputable) {
        this.progressbar('value', e.loaded * 100 / e.total);
    }
}

function strikethrough_convet(html) {
    if (!html.includes("<s>")) return html;
    let textile = html.replace(/<s>/g, "-").replace(/<\/s>/g, "-");
    return textile;
}
function underline_convert(html) {
    if (!html.includes("<u>")) return html;
    let textile = html.replace(/<u>/g, "<ins>").replace(/<\/u>/g, "</ins>");
    return textile;
}
function ins_to_underline(html) {
    if (!html.includes("<ins>")) return html;
    let textile = html.replace(/<ins>/g, "<u>").replace(/<\/ins>/g, "</u>");
    return textile;
}
function del_to_strike(html) {
    if (!html.includes("<del>")) return html;
    let textile = html.replace(/<del>/g, "<s>").replace(/<\/del>/g, "</s>");
    return textile;
  }
function bold_convert(text) {
    var patterns = [
        /\*\*/g,
        /\+\+/g,
        /\-\-/g, 
        /\_\_/g,
    ];

    var tags = [
        ["<b>", "</b>"],
        ["<ins>", "</ins>"],
        ["<s>", "</s>"],
        ["<em>", "</em>"],
    ];

    let result = text;

    patterns.forEach((pattern, index) => {
        let useOpeningTag = true;
        result = result.replace(pattern, () => {
            var tag = useOpeningTag ? tags[index][0] : tags[index][1];
            useOpeningTag = !useOpeningTag;
            return tag;
        });
    });

    return result;
}
function removeStyle(htmlString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    Array.from(doc.querySelectorAll('[style]')).forEach(el => el.removeAttribute('style'));
    var strippedString = doc.body.innerHTML;
    return strippedString
}
function convertPreToMarkdown(htmlString) {
    var preTagRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
    let markdownString = htmlString.replace(preTagRegex, (_, content) => {
        return `\`\`\`${content.trim()}\`\`\``;
    });
    return markdownString;
}
function convertMarkdownToPre(markdownString) {
    var codeBlockRegex = /```([\s\S]*?)```/g;
    let htmlString = markdownString.replace(codeBlockRegex, (_, content) => {
        return `<pre>${content.trim()}</pre>`;
    });
    return htmlString;
}
function replaceUrlWithAnchor(text) {
    text = text.replace(/&quot;/g, '"');
    var urlRegex = /"([^"]+)":(https?:\/\/[^"\s]+)/g;
    return text.replace(urlRegex, (match, text, url) => `<a href="${url}">${text}</a>`);
}
