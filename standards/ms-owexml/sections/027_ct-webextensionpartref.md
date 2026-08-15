<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_WebExtensionPartRef -->

### CT_WebExtensionPartRef


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[webextensionref](#Section_f4cab8d889584824a319310dc3514059), [CT_OsfTaskpane](#Section_555d296828234cb3b3174511dfc97bef)

<a id="CC_02fde075000000000000000000000000"></a>A complex type that specifies a container for a part relationship identifier that references a web extension part.

*Attributes:*

<a id="CC_2abc90bb000000000000000000000000"></a>__r:id: __An __ST_RelationshipId__ simple type ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 22.8.2.1, and [[MS-OI29500]](%5bMS-OI29500%5d.pdf#Section_1fd4a662862349c082f018fa91b413b8) section 2.1.1741) that specifies an identifier that references a web extension part.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_WebExtensionPartRef">
2.   <xsd:attribute ref="r:id" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
