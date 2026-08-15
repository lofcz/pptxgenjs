<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfWebExtensionBindingList -->

### CT_OsfWebExtensionBindingList


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_3ce85505000000000000000000000000"></a>This element specifies a list of [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) bindings.

*Child Elements:*

<a id="CC_1a435544000000000000000000000000"></a>__binding: __A __CT_OsfWebExtensionBinding __(section [2.2.3](#Section_c77600ca483748bb87d694654f414535)) element that specifies an Office Add-in binding.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionBindingList">
2.   <xsd:sequence>
3.     <xsd:element name="binding" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionBinding"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
