# adapt-blinds

**Blinds** is a *presentation component* created by Dan storey for the [Adapt framework](https://github.com/adaptlearning/adapt_framework). 

When a learner hovers on one of the images, it widens and the other images narrow accordingly. If set, text will appear and audio will play if enabled.  

## Installation

This component must be manually installed.

If **Blinds** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  

## Settings Overview

The attributes listed below are used in *components.json* to configure **Blinds**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-blinds/example.json).  

### Attributes

**_component** (string): This value must be: `blinds`.  

**_setCompletionOn** (string): This value determines when the component registers as complete. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` requires each blind to be visited. `"inview"` requires the **Blinds** component to enter the view port completely.  

**_height** (number): Height in pixels. Defaults to 500 if this property is not defined.  

**_items** (string): Each item represents one image for this component and contains values for **body**, **bodyReduced**, **_top**, **_left**, **_width**, **_graphic**, and **_audio**.  

>**body** (string): This text displays in the text box.  

>**bodyReduced** (string): This text displays in the text box when the [audio](https://github.com/deltanet/adapt-audio) text size is set to reduced.  

>**_top** (mixed): Each caption can contain optional **top**, **left** and **width** values to position them on the image. Values can be given as a number or string. A number will be interpreted as pixels but a string value may be used to specify a percentage (eg. "20%"). Default is 0. Multiple captions appear 10px below the previous one unless this value is specified.  

>**_left** (mixed): Specify the position of the caption from the left. Value can be given as a number or a string. Default is 0.  

>**_width** (mixed): Specify the max width of the caption. Value can be given as a string or a number. Default behaviour is to fit the width of the text.  

>**_graphic** (object): This `_graphic` attributes group stores the graphic properties for the item. It contains values for **_src** and **ariaLabel**.  

>>**_src** (string): The image to be used for the blind item. Since the image is used as a background image for a `div` no src, alt or title attributes are required.  

>>**ariaLabel** (string): This text becomes the image’s `aria label` attribute.  

>**_audio** (object): This `_audio` attributes group stores the audio properties for the item. It contains values for **_src**.  

>>**_src** (string): File name (including path) of the audio for the item. Path should be relative to the *src* folder. 

### Accessibility
Several elements of **Blinds** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **Blinds**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [*properties.schema*](https://github.com/deltanet/adapt-blinds/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

No known limitations.

----------------------------
**Version number:**  1.0  
**Framework versions supported:**  2.0  
**Author / maintainer:** Dan Storey / DeltaNet  
**Accessibility support:** Yes  
**RTL support:** Yes  
**Authoring tool support:** Yes  
