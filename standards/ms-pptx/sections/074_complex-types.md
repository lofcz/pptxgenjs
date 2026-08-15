<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_1580d44b60904e07a17767f345bf9269"></a><a id="_Toc174686000"></a>CT_SectionZoom

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom

*Referenced by: *[sectionZm](#Section_40214a8b104443fca9d53f8635ea5bc2)

<a id="CC_2b5939a1000000000000000000000000"></a>A complex type that specifies the [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) type as a Section Zoom container.

*Child Elements:*

<a id="CC_7025172b000000000000000000000000"></a>__sectionZmObj: __A [CT_SectionZoomObject](#Section_8d071b010b7b4fab968ed501a1c121b8) element that specifies the object type as a Section Zoom object.

<a id="CC_83c3f392000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the Zoom will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SectionZoom">
2.   <xsd:sequence>
3.     <xsd:element name="sectionZmObj" type="CT_SectionZoomObject" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6. </xsd:complexType>

See section [5.8](#Section_55c6a539eea9478fa6ff6ad2f1dde7e7) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_8d071b010b7b4fab968ed501a1c121b8"></a><a id="_Toc174686001"></a>CT_SectionZoomObject

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom

*Referenced by: *[CT_SectionZoom](#Section_1580d44b60904e07a17767f345bf9269)

<a id="CC_7c17ec2c000000000000000000000000"></a>A complex type that specifies the object type as a Section [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) object.

*Child Elements:*

<a id="CC_ced6c74d000000000000000000000000"></a>__zmPr: __A [CT_ZoomObjectProperties](#Section_059e3722139d4e419841d53eecaf73f6) element that specifies Section Zoom object properties.

<a id="CC_26a01079000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the Zoom will be stored in the extension list.

*Attributes:*

<a id="CC_a4df8679000000000000000000000000"></a>__sectionId: __A s:ST_Guid ([ISO/IEC29500-4:2016]section A.8.9) attribute that specifies the section ID that the Section Zoom object links to.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SectionZoomObject">
2.   <xsd:sequence>
3.     <xsd:element name="zmPr" type="p166:CT_ZoomObjectProperties" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="sectionId" type="s:ST_Guid" use="required"/>
7. </xsd:complexType>

See section [5.8](#Section_55c6a539eea9478fa6ff6ad2f1dde7e7) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
