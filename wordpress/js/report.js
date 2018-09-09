// report.js
//
// Version: 0.5
// Author: Bill Farmer

// Created by Bill Farmer
// Licence MIT
// Copyright (C) 2018 Bill Farmer

jQuery(document).ready(function($) {

    // Page parameters
    let A = getURLParameter('A');
    let B = getURLParameter('B');
    let C = getURLParameter('C');
    let D = getURLParameter('D');
    let E = getURLParameter('E');
    let F = getURLParameter('F');
    let S = getURLParameter('S');

    let forename = getURLParameter('forename');
    let lastname = getURLParameter('lastname');
    let email = getURLParameter('email');

    if (forename == undefined)
        forename = "Cat";
    if (lastname == undefined)
        lastname = "LeBlanc";

    forename = forename.replace('+', ' ');
    lastname = lastname.replace('+', ' ');
    
    let name = forename + " " + lastname;

    let pages = data.pages;
    let answers = data.answers;
    let notes = data.notes;
    let last = data.last;

    // Dimensions in points
    let pageWidth = 595;
    let pageHeight = 842;
    let margin = 72;
    let textWidth = pageWidth - (margin * 2);

    // Style buttons
    $("#update-preview, #download-report").button();

    // Add name
    $("#user-name").html(name);

    // Create document
    let doc = jsPDF({unit: 'pt',
                     compress: true});

    // Print front page and explanatory letter
    let pageno = 1;
    let images = 0;
    for (let page of pages)
    {
        pageno = page.pageno;
        if (pageno != 1)
            doc.addPage();

        for (let image of page.images)
            addImageObject(image, doc, pageno, update);

        let y = margin;
        for (let text of page.text)
            y = addTextObject(text, doc, y)
    }

    // Create report
    doc.addPage();
    let y = margin;
    pageno++;

    if (B)
    {
        let desc = answers['B'].desc;
        let type = answers['B'][B].type;
        let text = answers['B'][B].text;
        doc.setFontType('bold');
        y = addText(type, doc, margin, y, textWidth) + doc.getLineHeight();
        doc.setFontType('normal');
        y = addText(desc, doc, margin, y, textWidth) + doc.getLineHeight();
        y = addText(text, doc, margin, y, textWidth) + doc.getLineHeight();
    }

    if (C)
    {
        let desc = answers['C'].desc;
        let type = answers['C'][C].type;
        let text = answers['C'][C].text;
        doc.setFontType('bold');
        y = addText(type, doc, margin, y, textWidth) + doc.getLineHeight();
        doc.setFontType('normal');
        y = addText(desc, doc, margin, y, textWidth) + doc.getLineHeight();
        y = addText(text, doc, margin, y, textWidth) + doc.getLineHeight();
    }

    if (D)
    {
        let desc = answers['D'].desc;
        let type = answers['D'][D].type;
        let text = answers['D'][D].text;
        doc.setFontType('bold');
        y = addText(type, doc, margin, y, textWidth) + doc.getLineHeight();
        doc.setFontType('normal');
        y = addText(desc, doc, margin, y, textWidth) + doc.getLineHeight();
        y = addText(text, doc, margin, y, textWidth) + doc.getLineHeight();
    }

    doc.addPage();
    y = margin;
    pageno++;

    if (E)
    {
        let desc = answers['E'].desc;
        let type = answers['E'][E].type;
        let text = answers['E'][E].text;
        doc.setFontType('bold');
        y = addText(type, doc, margin, y, textWidth) + doc.getLineHeight();
        doc.setFontType('normal');
        y = addText(desc, doc, margin, y, textWidth) + doc.getLineHeight();
        y = addText(text, doc, margin, y, textWidth) + doc.getLineHeight();
    }

    if (F)
    {
        let desc = answers['F'].desc;
        let type = answers['F'][F].type;
        let text = answers['F'][F].text;
        doc.setFontType('bold');
        y = addText(type, doc, margin, y, textWidth) + doc.getLineHeight();
        doc.setFontType('normal');
        y = addText(desc, doc, margin, y, textWidth) + doc.getLineHeight();
        y = addText(text, doc, margin, y, textWidth) + doc.getLineHeight();
    }

    // Last page
    doc.addPage();
    y = margin;
    pageno++;

    // Images
    for (let image of last.images)
        addImageObject(image, doc, pageno, update);

    // Text
    for (let text of last.text)
        y = addTextObject(text, doc, y);

    $("#update").click(update);

    $('#download-report').click(function() {
        doc.save('report.pdf');
    });

    function update() {
        let string = doc.output('bloburi');
	$('#report-preview').attr('src', string);
    }

    /**
     * Gets URL parameter value.
     * @name  getURLParameter
     * @param param  Parameter to return
     * @returns Parameter value
     */
    function getURLParameter(param)
    {
        let pageURL = window.location.search.substring(1);
        let URLParameters = pageURL.split('&');
        for (let parameter of URLParameters)
        {
            let parameterName = parameter.split('=');
            if (parameterName[0] == param)
                return parameterName[1];
        }
    }

    function addTextObject(text, doc, y)
    {
        if (text.size)
            doc.setFontSize(text.size);
        if (text.type)
            doc.setFontType(text.type);
        if (text.color)
            doc.setTextColor(text.color);
        y = text.y? text.y: y;
        let string = text.text;
        if (string.match(/~[a-z]+~/))
            string = string.replace(/~forename~/g, forename)
            .replace(/~lastname~/g, lastname);
        return addText(string, doc, margin, y, textWidth);
    }

    function addImageObject(image, doc, pageno, func)
    {
        let y = image.y;
        y = y? (y < 0)? -pageHeight + margin: y: margin;
        let x = image.x;
        x = x? (x < 0)? -pageWidth + margin: x: margin;
        let width = image.width;
        width = width? width: textWidth;
        addImage(image.src, image.type, doc, pageno, x, y,
                 width, image.height, image.link, func);
    }

    /**
     * Adds text to document.
     * @name  addText
     * @param text   Text to add
     * @param doc    jsPDF document
     * @param x      X location on page
     * @param y      Y location on page
     * @param width  Text width on page
     * @returns Y location of bottom of text
     */
    function addText(text, doc, x, y, width) {
        let textLines = doc.splitTextToSize(text, width);
        doc.text(textLines, x, y);
        return y + (textLines.length * doc.getLineHeight());
    }

    /**
     * Adds image to document.
     * @name  addImage
     * @param src    Path to image to add
     * @param type   Type of image, 'png' or 'jpeg'
     * @param doc    jsPDF document
     * @param page   Page number to place image
     * @param x      X location on page
     * @param y      Y location on page
     * @param width  Image width on page
     * @param height Image height on  page
     * @param link   Link to add to image
     * @param func   Function to call after image added
     * @description
     * If the x parameter is negative, used as right edge of image.
     * If the y parameter is negative, used as bottom edge of image.
     * If the height is null or 0, height is calculated to
     * preserve image aspect ratio.
     */
    function addImage(src, type, doc, page, x, y, width, height, link, func) {
        images++;
        let img = new Image();
        img.src = plugin_url + src;
        img.addEventListener('load', function(event) {
            let data = getDataUrl(event.currentTarget, type);
            height = height? height: width * data.height / data.width;
            x = x < 0? -x - width: x;
            y = y < 0? -y - height: y;
            doc.setPage(page);
            doc.addImage(data.url, type, x, y, width, height);
            if (link)
            {
                let options = {url: link};
                doc.link(x, y, width, height, options);
            }
            if (--images == 0 && func)
                func();
        });
    }

    /**
     * Gets data URL, width, height for image.
     * @name  getDataUrl
     * @param img  Image object
     * @param type Type of image, 'png' or 'jpeg'
     * @returns {url: data URL,
     *           width: image width,
     *           height: image height}
     */
    function getDataUrl(img, type) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        return {url: canvas.toDataURL('image/' + type),
                width: img.width,
                height: img.height};
    }
});
