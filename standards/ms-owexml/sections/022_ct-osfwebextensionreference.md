<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfWebExtensionReference -->

### CT_OsfWebExtensionReference


*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtensionReferenceList](#Section_cb8fc4aa8a8845ee9c783dc66be8a765), [CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_e76ba3bc000000000000000000000000"></a>This element specifies the reference to an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178). The reference is used to identify the provider location and version of the extension.

*Child Elements:*

<a id="CC_4d3b64d0000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) that specifies a list of extensions for an Office Add-in. This element MAY be ignored.

*Attributes:*

<a id="CC_e3a33fa8000000000000000000000000"></a>__id: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the identifier associated with the Office Add-in within a catalog provider. The identifier MUST be unique within a [__catalog provider__](#gt_3f2b5b54-7b39-4c73-9cbf-2dad50919ccd).

<a id="CC_34fba4d8000000000000000000000000"></a>__version: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the version of the Office Add-in.

<a id="CC_6878cdad000000000000000000000000"></a>__store: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the instance of the marketplace where the Office Add-in is stored.

<a id="CC_40a83d43000000000000000000000000"></a>__storeType: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the type of marketplace that the store attribute identifies. Default is "SPCatalog" (Corporate Catalog). The value MUST be in the following table:

Value

Meaning

OMEX

Specifies that the store type is Office.com.

SPCatalog

Specifies that the store type is SharePoint corporate catalog.

SPApp

Specifies that the store type is a SharePoint [__web application__](#gt_6b0c6982-1354-4309-86eb-c4c4ae9d8bcb).

Exchange

Specifies that the store type is an Exchange server.

FileSystem

Specifies that the store type is a file system share.

Registry

Specifies that the store type is the system registry.

ExCatalog

Specifies that the store type is Centralized Deployment via Exchange.

WOPICatalog

Specifies that the store type is a WOPI host.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionReference">
2.   <xsd:sequence>
3.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="id" type="xsd:string" use="required"/>
6.   <xsd:attribute name="version" type="xsd:string" use="required"/>
7.   <xsd:attribute name="store" type="xsd:string"/>
8.   <xsd:attribute name="storeType" type="xsd:string" use="optional"/>
9. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
