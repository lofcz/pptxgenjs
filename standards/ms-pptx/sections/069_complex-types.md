<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_059e3722139d4e419841d53eecaf73f6"></a><a id="_Toc174685992"></a>CT_ZoomObjectProperties

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/6/main

*Referenced by: *[CT_SectionZoomObject](#Section_8d071b010b7b4fab968ed501a1c121b8), [CT_SlideZoomObject](#Section_c16836046df448599e9ddac99077d340), [CT_SummaryZoomObject](#Section_9a9877dc4d074ee3a598108d34798095)

<a id="CC_662102fa000000000000000000000000"></a>A complex type that specifies properties of a [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) object.

*Child Elements:*

<a id="CC_32d02c65000000000000000000000000"></a>__blipFill: __An a:CT_BlipFillProperties ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.4) element that specifies the type of picture fill that the object uses.

<a id="CC_2df1b366000000000000000000000000"></a>__spPr: __An a:CT_ShapeProperties ([ISO/IEC29500-1:2016] section A.4.1) element that specifies the visual shape properties that can be applied to the object.

*Attributes:*

<a id="CC_f7cbf623000000000000000000000000"></a>__id: __A s:ST_Guid ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.8.9) attribute that specifies the unique ID of the Zoom object.

<a id="CC_fda04f9f000000000000000000000000"></a>__returnToParent: __An xsd:boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies return to parent navigation behavior in slideshow.

<a id="CC_93fb4001000000000000000000000000"></a>__imageType: __An [ST_ZoomObjectImageType](#Section_9a710598459041a19c0fb34c63b9866d) attribute that specifies whether a custom cover image is used, or the slide preview.

<a id="CC_2770df17000000000000000000000000"></a>__transitionDur: __An [ST_UniversalTimeOffset](#Section_a3ead080d9cb4b4a80146d815248c23b) attribute that specifies the duration of the transition between Zoom and slide. If not specified, it will use the destination slide transition and the timings associated with that transition.

<a id="CC_1a4b9f65000000000000000000000000"></a>__showBg: __An xsd:boolean ([XMLSCHEMA2/2] section 3.2.2) attribute that specifies whether the Zoom will use the background of the destination slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ZoomObjectProperties">
2.   <xsd:sequence>
3.     <xsd:element name="blipFill" type="a:CT_BlipFillProperties" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="spPr" type="a:CT_ShapeProperties" minOccurs="1" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
7.   <xsd:attribute name="returnToParent" type="xsd:boolean" use="optional" default="true"/>
8.   <xsd:attribute name="imageType" type="ST_ZoomObjectImageType" use="optional" default="preview"/>
9.   <xsd:attribute name="transitionDur" type="p14:ST_UniversalTimeOffset" use="optional"/>
10.   <xsd:attribute name="showBg" type="xsd:boolean" use="optional" default="true"/>
11. </xsd:complexType>

See section [5.7](#Section_84585d01dfd5403e923527853aff4d46) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
