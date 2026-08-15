<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfWebExtension -->

### CT_OsfWebExtension


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[webextension](#Section_56fe5a64dd6d422cbeac19d72dd10ade)

<a id="CC_b541ebdc000000000000000000000000"></a>This is the root element of an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) document part.

*Child Elements:*

<a id="CC_2f3ce557000000000000000000000000"></a>__reference: __A __CT_OsfWebExtensionReference__ element (section [2.2.5](#Section_d4081e0b571145deb7081dfa1b943ad1)) that specifies the primary reference to an Office Add-in.

<a id="CC_9c82d287000000000000000000000000"></a>__alternateReferences: __A __CT_OsfWebExtensionReferenceList__ element (section [2.2.6](#Section_cb8fc4aa8a8845ee9c783dc66be8a765)) that specifies a list of __CT_OsfWebExtensionReference__ elements (section 2.2.5). The first of these __alternateReferences__ is used if the Office Add-in could not be located using the primary reference.

<a id="CC_8daf3283000000000000000000000000"></a>__properties: __A __CT_OsfWebExtensionPropertyBag__ element (section [2.2.2](#Section_9548c2c38c794b799f4eb799e8d40f49)) that contains a set of Office Add-in custom properties.

<a id="CC_0e9485db000000000000000000000000"></a>__bindings: __A __CT_OsfWebExtensionBindingList__ element (section [2.2.4](#Section_4e550573e9cb45929131e17cfc660453)) that specifies a list of Office Add-in bindings.

<a id="CC_143947d9000000000000000000000000"></a>__snapshot: __A __CT_Blip__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 20.1.8.13) that specifies a static image used to render the contents of the Office Add-in when it is not active. 

<a id="CC_65a94bb4000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([ISO/IEC29500-1:2016] section A.4.1) that specifies a list of extensions for an Office Add-in. This element MAY be ignored.

*Attributes:*

<a id="CC_8aaa9ac5000000000000000000000000"></a>__id: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1). This attribute uniquely identifies the Office Add-in instance in the current document.

<a id="CC_ecc2abd7000000000000000000000000"></a>__frozen: __A Boolean attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the user can interact with the Office Add-in or not.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtension">
2.   <xsd:sequence>
3.     <xsd:element name="reference" type="CT_OsfWebExtensionReference"/>
4.     <xsd:element name="alternateReferences" type="CT_OsfWebExtensionReferenceList" minOccurs="0" maxOccurs="1"/>
5.     <xsd:element name="properties" type="CT_OsfWebExtensionPropertyBag"/>
6.     <xsd:element name="bindings" type="CT_OsfWebExtensionBindingList"/>
7.     <xsd:element name="snapshot" type="a:CT_Blip" minOccurs="0" maxOccurs="1"/>
8.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
9.   </xsd:sequence>
10.   <xsd:attribute name="id" type="xsd:string" use="required"/>
11.   <xsd:attribute name="frozen" type="xsd:boolean" use="optional" default="false"/>
12. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
