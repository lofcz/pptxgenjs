<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_ContainsCustomFunctions -->

### CT_ContainsCustomFunctions


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_0a673f5b000000000000000000000000"></a>Flag indicating that the add-in contains custom functions that are used by the workbook__.__

*Attributes:*

<a id="CC_8da13765000000000000000000000000"></a>__val: __A boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies whether a custom function is used in a spreadsheet application__.__ 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ContainsCustomFunctions">
2.   <xsd:attribute name="val" type="xsd:boolean" use="optional" default="false"/>
3. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
