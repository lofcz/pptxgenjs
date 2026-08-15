<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_BackgroundAppData -->

### CT_BackgroundAppData


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_d2e231bc000000000000000000000000"></a>A complex type that specifies the startup behavior for current runtime when document is opened for the [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178).

*Attributes:*

<a id="CC_735c23fc000000000000000000000000"></a>__state: __An int [[[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.17] attribute that specifies the startup state for the current runtime when document is opened for the Office Add-in.

<a id="CC_3ec5268e000000000000000000000000"></a>__runtimeId: __A string [[XMLSCHEMA2/2] section 3.2.1] attribute uniquely identifies the current runtime instance of the Office Add-in in the current document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_BackgroundAppData">
2.   <xsd:attribute name="state" type="xsd:int" use="required"/>
3.   <xsd:attribute name="runtimeId" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
