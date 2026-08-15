<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfWebExtensionBinding -->

### CT_OsfWebExtensionBinding


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtensionBindingList](#Section_4e550573e9cb45929131e17cfc660453)

<a id="CC_a057d214000000000000000000000000"></a>A complex type that specifies a binding relationship between an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) and the data in the document. 

*Child Elements:*

<a id="CC_f3eb6690000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) that specifies a list of extensions for an Office Add-in. This element MAY be ignored.

*Attributes:*

<a id="CC_1029b64a000000000000000000000000"></a>__id: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the binding identifier.

<a id="CC_1d4ca641000000000000000000000000"></a>__type: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the binding type.

<a id="CC_6b78448c000000000000000000000000"></a>__appref: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the binding key used to map the binding entry in this list with the bound data in the document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionBinding">
2.   <xsd:sequence>
3.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="id" type="xsd:string" use="required"/>
6.   <xsd:attribute name="type" type="xsd:string" use="required"/>
7.   <xsd:attribute name="appref" type="xsd:string" use="required"/>
8. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
