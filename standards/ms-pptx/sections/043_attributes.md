<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Attributes -->

### Attributes


#### <a id="section_1a4ace6fc76241f2870750220fc6cd9c"></a><a id="_Toc174685899"></a>bounceEnd

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_5ea35fed000000000000000000000000"></a>An __s:ST_PositiveFixedPercentage__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.8.9) that specifies the percentage of the [__time node__](#gt_9119779c-a57f-45b7-a9b2-1ceab434560f)'s duration to do a bounce at the end of the animation. The bounce emulates a mass-spring-damper system. See section [2.2.2](#Section_3dae7e98e8ea426598e041146b9eb838) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this attribute.

1. <xsd:attribute name="bounceEnd" type="s:ST_PositiveFixedPercentage"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_057a6a2bbcef42578cefaf99a2eca7ea"></a><a id="_Toc174685900"></a>bwMode

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_3a55bd50000000000000000000000000"></a>An __a:ST_BlackWhiteMode__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies how to interpret color information contained within a content part to achieve a color, black and white, or grayscale rendering of the content part. This attribute specifies only the rendering mode applied to the content part; it does not affect how the actual color information is persisted. See section [2.2.3](#Section_a05ae034990f44748c975c70bb0a9862) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this attribute.

1. <xsd:attribute name="bwMode" type="a:ST_BlackWhiteMode"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9032bdb2b273470b8ac4c98a8c944494"></a><a id="_Toc174685901"></a>dur

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_52d69001000000000000000000000000"></a>An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) that specifies the time a transition takes to display from start to finish. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this attribute.

1. <xsd:attribute name="dur" type="p14:ST_UniversalTimeOffset"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_55d9bdbe840f4da480ede3248518ff84"></a><a id="_Toc174685902"></a>presetBounceEnd

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_aeca9869000000000000000000000000"></a>An __s:ST_PositiveFixedPercentage__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.8.9) that specifies a preset percentage of a [__time node__](#gt_9119779c-a57f-45b7-a9b2-1ceab434560f)'s duration to do a bounce at the end of the animation. This value is used only by the user interface. The actual bounce animations are specified by the __bounceEnd__ (section [2.3.2.1](#Section_1a4ace6fc76241f2870750220fc6cd9c)) attributes. See section [2.2.2](#Section_3dae7e98e8ea426598e041146b9eb838) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this attribute.

1. <xsd:attribute name="presetBounceEnd" type="s:ST_PositiveFixedPercentage"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
