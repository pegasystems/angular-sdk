import { useState, useRef, React} from "react";
import { EmailDisplay, PhoneDisplay, URLDisplay, Image, Button, Lightbox } from '@pega/cosmos-react-core';

export const formatExists = (formatterVal) => {
    const formatterValues = [
      "TextInput",
      "WorkStatus",
      "RichText",
      "Email",
      "Phone",
      "URL",
      "Operator"
    ];
    let isformatter = false;
    if (formatterValues.includes(formatterVal)) {
      isformatter = true;
    }
    return isformatter;
  };

const urlLabelVal = (urlLabelSelection, btnVal, urlLabel, propUrlLabel) => {
  if ((urlLabel !== '' || propUrlLabel !== '') && btnVal !== null) {
    switch (urlLabelSelection) {
      case 'constant': {
        btnVal = urlLabel;
        break;
      }
      case 'propertyRef': {
        btnVal = propUrlLabel;
        break;
      }
      // no default
    }
  }
  return btnVal;
};

const isImage = (url) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);

const TableImage = (imageProps) => {
  const { value, altText, altTextOfImage, propaltTextOfImage, urlLabelSelection, urlLabel, propUrlLabel } = imageProps;
  const demoButtonRef = useRef(null);
  let imageDisplayComp = null;
  const [images, setImages] = useState(null);
  const imgDescription = {
    id: 'url',
    name: urlLabelSelection === 'constant' ? urlLabel : propUrlLabel,
    description: altText === 'constant' ? altTextOfImage : propaltTextOfImage,
    src: value
  };
  const onClick = () => {
    setImages([imgDescription]);
  };
  const onItemDownload = async (id) => {
    const a = document.createElement('a');
    a.href = await fetch(images[0].src)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
    a.download = images?.find((image) => image.id === id)?.name ?? id;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  let btnVal = value;
  btnVal = urlLabelVal(urlLabelSelection, btnVal, urlLabel, propUrlLabel);
  imageDisplayComp = (
    <React.Fragment>
      {btnVal !== null && (
        <Button ref={demoButtonRef} variant='link' compact={false} onClick={onClick} autoFocus>
          {btnVal}
        </Button>
      )}
      {images && (
        <Lightbox
          items={images}
          cycle={false}
          onAfterClose={() => {
            setImages(null);
            demoButtonRef.current?.focus();
          }}
          onItemDownload={isImage(images[0].src) ? onItemDownload : undefined}
        />
      )}
    </React.Fragment>
  );
  return imageDisplayComp;
};

export const textFormatter = (formatter,value) => {
  let displayComponent = null;
  switch(formatter){
    case "TextInput" : {
      displayComponent = value;
      break;
    }
    case "Email" : {
      displayComponent = (<EmailDisplay value={value} displayText={value} variant="link" />);
      break;
    }
    case "Phone" : {
      displayComponent = (<PhoneDisplay value={value} variant="link" />);
      break;
    }
    case "URL" : {
      displayComponent = (<URLDisplay target="_blank" value={value} displayText={value} variant="link" />);
      break;
    }
    // no default
  }
  return displayComponent;
};

/**
 * Returns a URL display component based on the options
 * @function urlFormatter
 * @param {string} value value
 * @param {object} options options for formatting
 * { displayAs,tableDisplayAs,isTableFormatter,altText,altTextOfImage,propaltTextOfImage,urlLabelSelection, urlLabel,propUrlLabel, widthSel, customWidth}
 */
export const urlFormatter = (value, options) => {
  const {
    displayAs,
    tableDisplayAs,
    isTableFormatter,
    altText,
    altTextOfImage,
    propaltTextOfImage,
    urlLabelSelection,
    urlLabel,
    propUrlLabel,
    widthSel,
    customWidth
  } = options;

  let urlFormatComp = null;
  if (
    (displayAs === 'labelText' || (isTableFormatter && tableDisplayAs === 'link')) &&
    (urlLabel !== '' || propUrlLabel !== '')
  ) {
    urlFormatComp = (
      <URLDisplay
        target='_blank'
        value={value}
        displayText={urlLabelSelection === 'constant' ? urlLabel : propUrlLabel}
        variant='link'
      />
    );
  } else if ((displayAs === 'Image' || tableDisplayAs === 'Image') && !!value) {
    if (isTableFormatter) {
      urlFormatComp = TableImage({
        value,
        altText,
        altTextOfImage,
        propaltTextOfImage,
        urlLabelSelection,
        urlLabel,
        propUrlLabel
      });
    } else {
      const width = widthSel === 'widthpx' ? customWidth : null;
      urlFormatComp = (
        <Image src={value} width={width} alt={altText === 'constant' ? altTextOfImage : propaltTextOfImage} />
      );
    }
  } else {
    urlFormatComp = <URLDisplay target='_blank' value={value} displayText={value} variant='link' />;
  }
  return urlFormatComp;
};
