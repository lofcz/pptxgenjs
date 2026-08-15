<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_2dbe05e43fad4bc787762db5e2869da8"></a><a id="_Toc174686177"></a>CT_PlaceholderTypeACB

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2023/02/main

*Referenced by: *[CT_PlaceholderTypeExtension](#Section_9781d4dc4f68440f91cc8f70ea0bd6bb)

<a id="CC_626121bd000000000000000000000000"></a>A complex type that extends placeholder element to define new types.

*Child Elements:*

<a id="CC_8fc6f752000000000000000000000000"></a>__cameo: __A p:CT_Empty ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) element that specifies a cameo placeholder type.

<a id="CC_e35907a5000000000000000000000000"></a>__unknown: __A p:CT_Empty ([ISO/IEC29500-4:2016] section A.4) element that specifies an unknown placeholder type. This is for future extension.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_PlaceholderTypeACB">
2.   <xsd:sequence>
3.     <xsd:choice minOccurs="1" maxOccurs="1">
4.       <xsd:element name="cameo" type="p:CT_Empty"/>
5.       <xsd:element name="unknown" type="p:CT_Empty"/>
6.     </xsd:choice>
7.   </xsd:sequence>
8. </xsd:complexType>

See section [5.20](#Section_36179565a6864c4ca0747ed8b8808b7e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9781d4dc4f68440f91cc8f70ea0bd6bb"></a><a id="_Toc174686178"></a>CT_PlaceholderTypeExtension

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2023/02/main

*Referenced by: *[phTypeExt](#Section_63c50e68cd534a999017c6748f4d7d47)

<a id="CC_3fa35408000000000000000000000000"></a>A complex type that specifies a sequence of placeholder type ACBs.

*Child Elements:*

<a id="CC_c8e57830000000000000000000000000"></a>__type: __A [CT_PlaceholderTypeACB](#Section_2dbe05e43fad4bc787762db5e2869da8) element that specifies the extended type of a placeholder.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_PlaceholderTypeExtension">
2.   <xsd:sequence>
3.     <xsd:element name="type" type="CT_PlaceholderTypeACB" minOccurs="1" maxOccurs="1"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.20](#Section_36179565a6864c4ca0747ed8b8808b7e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
