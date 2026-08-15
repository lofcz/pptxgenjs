<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_16fcef9f1d29417d961015ac6aeff42a"></a><a id="_Toc174686008"></a>CT_SlideZoom

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/slidezoom

*Referenced by: *[sldZm](#Section_623f4c8ecd0a4c188c9df7be9cfbfd72)

<a id="CC_28c11350000000000000000000000000"></a>A complex type that specifies the [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) type as a Slide Zoom container.

*Child Elements:*

<a id="CC_e140a588000000000000000000000000"></a>__sldZmObj: __A [CT_SlideZoomObject](#Section_c16836046df448599e9ddac99077d340) element that specifies the object type as a Slide Zoom object.

<a id="CC_b11d272c000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the Zoom will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideZoom">
2.   <xsd:sequence>
3.     <xsd:element name="sldZmObj" type="CT_SlideZoomObject" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6. </xsd:complexType>

See section [5.9](#Section_87141ff266094acca63f1b230b4a1b38) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c16836046df448599e9ddac99077d340"></a><a id="_Toc174686009"></a>CT_SlideZoomObject

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/slidezoom

*Referenced by: *[CT_SlideZoom](#Section_16fcef9f1d29417d961015ac6aeff42a)

<a id="CC_04204db0000000000000000000000000"></a>A complex type that specifies the object type as a Slide [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) object.

*Child Elements:*

<a id="CC_82619be9000000000000000000000000"></a>__zmPr: __A [CT_ZoomObjectProperties](#Section_059e3722139d4e419841d53eecaf73f6) element that specifies the Slide Zoom object properties.

<a id="CC_0608a8fc000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the Zoom will be stored in the extension list.

*Attributes:*

<a id="CC_3badcb32000000000000000000000000"></a>__sldId: __A p:ST_SlideId ([ISO/IEC29500-4:2016] section A.4) attribute that specifies the slide ID that the Slide Zoom object links to.

<a id="CC_315b6d7f000000000000000000000000"></a>__cId: __An xsd:unsignedInt ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) attribute that specifies the creation ID (see section [2.3.1.4](#Section_82a107ddbeeb46468bd248f433e1d62e)) that the Slide Zoom object links to.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideZoomObject">
2.   <xsd:sequence>
3.     <xsd:element name="zmPr" type="p166:CT_ZoomObjectProperties" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="sldId" type="p:ST_SlideId" use="required"/>
7.   <xsd:attribute name="cId" type="xsd:unsignedInt" use="optional"/>
8. </xsd:complexType>

See section [5.9](#Section_87141ff266094acca63f1b230b4a1b38) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
