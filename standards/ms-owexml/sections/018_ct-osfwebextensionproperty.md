<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfWebExtensionProperty -->

### CT_OsfWebExtensionProperty


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtensionPropertyBag](#Section_9548c2c38c794b799f4eb799e8d40f49)

<a id="CC_eee94eac000000000000000000000000"></a>A complex type that specifies an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) custom property.

*Attributes:*

<a id="CC_8aba3374000000000000000000000000"></a>__name: __A string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609)  section 3.2.1) attribute that specifies a custom property name.

<a id="CC_cd445727000000000000000000000000"></a>__value: __A string ([XMLSCHEMA2/2] section 3.2.1) attribute that specifies a custom property value.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionProperty">
2.   <xsd:attribute name="name" type="xsd:string" use="required"/>
3.   <xsd:attribute name="value" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
