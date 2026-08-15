<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfWebExtensionPropertyBag -->

### CT_OsfWebExtensionPropertyBag


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_93fe2c01000000000000000000000000"></a>This element specifies a set of [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) custom properties.

*Child Elements:*

<a id="CC_020f92aa000000000000000000000000"></a>__property: __A __CT_OsfWebExtensionProperty__ (section [2.2.1](#Section_7011fb2bb6ed429faabcfc65f37b5ab8)) element that specifies a single Office Add-in custom property.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionPropertyBag">
2.   <xsd:sequence>
3.     <xsd:element name="property" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionProperty"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
