<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_CustomFunctionList -->

### CT_CustomFunctionList


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_f707bd7b000000000000000000000000"></a>This element specifies a list of custom functions of the [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178).

*Child Elements:*

<a id="CC_c37b485d000000000000000000000000"></a>__customFunctionIds: __A string [[[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1] element that identifies one custom function in the Office Add-in.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CustomFunctionList">
2.   <xsd:sequence>
3.     <xsd:element name="customFunctionIds" type="xsd:string" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
