<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_921a4cfb4557435ab29f2e88354bdbd1"></a><a id="_Toc174686016"></a>CT_FixedLayout

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom

*Referenced by: *[CT_SummaryZoom](#Section_9ae06ed959434a969733c9f4cd3580e6)

<a id="CC_5315b5f0000000000000000000000000"></a>A complex type that specifies the layout with user-defined [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) positioning.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_FixedLayout"/>

See section [5.10](#Section_3aa207bf1c1a4bb9877616d130f1557f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_cc991d0fdf434c0fbd0758ba8cadcfd0"></a><a id="_Toc174686017"></a>CT_GridLayout

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom

*Referenced by: *[CT_SummaryZoom](#Section_9ae06ed959434a969733c9f4cd3580e6)

<a id="CC_0ed3ed50000000000000000000000000"></a>A complex type that specifies the layout as a grid layout for a list of objects.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_GridLayout"/>

See section [5.10](#Section_3aa207bf1c1a4bb9877616d130f1557f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9ae06ed959434a969733c9f4cd3580e6"></a><a id="_Toc174686018"></a>CT_SummaryZoom

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom

*Referenced by: *[summaryZm](#Section_68d01d06c23447b3b191af013beb1a19)

<a id="CC_04d63de5000000000000000000000000"></a>A complex type that specifies the [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) type as a Summary Zoom.

*Child Elements:*

<a id="CC_b8f6b750000000000000000000000000"></a>__summaryZmObj: __A [CT_SummaryZoomObject](#Section_9a9877dc4d074ee3a598108d34798095) element that specifies the object type as a Summary Zoom object.

<a id="CC_a2fb9ab5000000000000000000000000"></a>__gridLayout: __A [CT_GridLayout](#Section_cc991d0fdf434c0fbd0758ba8cadcfd0) element that specifies the layout as a grid layout for a list of objects.

<a id="CC_cb134d55000000000000000000000000"></a>__fixedLayout: __A [CT_FixedLayout](#Section_921a4cfb4557435ab29f2e88354bdbd1) element that specifies the layout with user-defined Zoom positioning. 

<a id="CC_7cd6dfe8000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the Zoom will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SummaryZoom">
2.   <xsd:sequence>
3.     <xsd:element name="summaryZmObj" type="CT_SummaryZoomObject" minOccurs="0" maxOccurs="unbounded"/>
4.     <xsd:choice minOccurs="1" maxOccurs="1">
5.       <xsd:element name="gridLayout" type="CT_GridLayout"/>
6.       <xsd:element name="fixedLayout" type="CT_FixedLayout"/>
7.     </xsd:choice>
8.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
9.   </xsd:sequence>
10. </xsd:complexType>

See section [5.10](#Section_3aa207bf1c1a4bb9877616d130f1557f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9a9877dc4d074ee3a598108d34798095"></a><a id="_Toc174686019"></a>CT_SummaryZoomObject

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom

*Referenced by: *[CT_SummaryZoom](#Section_9ae06ed959434a969733c9f4cd3580e6)

<a id="CC_1c9d1dca000000000000000000000000"></a>A complex type that specifies the object type as a Summary [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) object.

*Child Elements:*

<a id="CC_2d47426a000000000000000000000000"></a>__zmPr: __A [CT_ZoomObjectProperties](#Section_059e3722139d4e419841d53eecaf73f6) element that specifies Summary Zoom object properties.

<a id="CC_4f4f8bd3000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the Zoom will be stored in the extension list.

*Attributes:*

<a id="CC_1f6caa43000000000000000000000000"></a>__sectionId: __A s:ST_Guid ([ISO/IEC29500-4:2016] section A.8.9) attribute that specifies the section ID that the Summary Zoom object links to.

<a id="CC_45ac567c000000000000000000000000"></a>__title: __An xsd:string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies the Alt text title of the Summary Zoom object.

<a id="CC_f7cb6ffb000000000000000000000000"></a>__descr: __An xsd:string ([XMLSCHEMA2/2] section 3.2.1) attribute that specifies the Alt text description of the Summary Zoom object.

<a id="CC_acf9b62c000000000000000000000000"></a>__offsetFactorX: __An a:ST_Percentage ([ISO/IEC29500-4:2016] section 17.2.2.2) attribute that specifies the percentage that the object is offset on the x-axis from the default layout.

<a id="CC_385eb62c000000000000000000000000"></a>__offsetFactorY: __An a:ST_Percentage ([ISO/IEC29500-4:2016] section 17.2.2.2) attribute that specifies the percentage that the object is offset on the y-axis from the default layout.

<a id="CC_eb36ad61000000000000000000000000"></a>__scaleFactorX: __An a:ST_Percentage ([ISO/IEC29500-4:2016] section 17.2.2.2) attribute that specifies the percentage that the object is scaled on the x-axis from the default layout.

<a id="CC_488f38c6000000000000000000000000"></a>__scaleFactorY: __An a:ST_Percentage ([ISO/IEC29500-4:2016] section 17.2.2.2) attribute that specifies the percentage that the object is scaled on the y-axis from the default layout.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SummaryZoomObject">
2.   <xsd:sequence>
3.     <xsd:element name="zmPr" type="p166:CT_ZoomObjectProperties" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="sectionId" type="s:ST_Guid" use="required"/>
7.   <xsd:attribute name="title" type="xsd:string" use="optional" default=""/>
8.   <xsd:attribute name="descr" type="xsd:string" use="optional" default=""/>
9.   <xsd:attribute name="offsetFactorX" type="a:ST_Percentage" use="optional" default="0"/>
10.   <xsd:attribute name="offsetFactorY" type="a:ST_Percentage" use="optional" default="0"/>
11.   <xsd:attribute name="scaleFactorX" type="a:ST_Percentage" use="optional" default="100000"/>
12.   <xsd:attribute name="scaleFactorY" type="a:ST_Percentage" use="optional" default="100000"/>
13. </xsd:complexType>

See section [5.10](#Section_3aa207bf1c1a4bb9877616d130f1557f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
