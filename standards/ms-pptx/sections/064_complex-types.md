<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_bda2442f36394c0ea57163911b0558c6"></a><a id="_Toc174685982"></a>CT_ClientRevision

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/10/main

*Referenced by: *[CT_ClientRevisionList](#Section_fdacf9e7c8aa4eb4be0270ed3f5d0bd8)

<a id="CC_ea69f9b3000000000000000000000000"></a>A complex type that specifies information about a set of modifications made to the document by a collaborating application instance.

*Attributes:*

<a id="CC_27f3c659000000000000000000000000"></a>__id: __An [ST_ClientID](#Section_65206abbcfaf489390b74674660c6933) attribute that specifies a unique identifier for an application instance in a collaborative session.

<a id="CC_fd049176000000000000000000000000"></a>__v: __An [ST_ClientRevisionNumber](#Section_84bd8c757410499e9a2ce7d3ad3b7c47) attribute that specifies a unique identifier for the latest revision made by this application instance that has been saved by this application instance.

<a id="CC_0ce65df1000000000000000000000000"></a>__vWet: __An ST_ClientRevisionNumber attribute that specifies an identifier for the latest revision made by this application instance that was saved by an application instance other than this application instance. A scenario when this attribute is applied is when a modification made by this application instance is sent to another application instance via a communication channel, and the other application instance saves the modification before this application instance does.

<a id="CC_52761009000000000000000000000000"></a>__dt: __An xsd:dateTime ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.7) attribute that specifies the date and time of the latest revision specified by __v__ or __vWet__, whichever is the later.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ClientRevision">
2.   <xsd:attribute name="id" type="ST_ClientID" use="required"/>
3.   <xsd:attribute name="v" type="ST_ClientRevisionNumber" use="optional" default="0"/>
4.   <xsd:attribute name="vWet" type="ST_ClientRevisionNumber" use="optional" default="0"/>
5.   <xsd:attribute name="dt" type="xsd:dateTime" use="required"/>
6. </xsd:complexType>

See section [5.5](#Section_e5047fb05d6d421fbfe9ce8cd549843f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_fdacf9e7c8aa4eb4be0270ed3f5d0bd8"></a><a id="_Toc174685983"></a>CT_ClientRevisionList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/10/main

*Referenced by: *[CT_RevisionInfo](#Section_e26a765990dd41a09f553f34da837535)

<a id="CC_203c53ac000000000000000000000000"></a>A complex type that specifies a list of revisions to the document.

*Child Elements:*

<a id="CC_e12585d8000000000000000000000000"></a>__client: __A [CT_ClientRevision](#Section_bda2442f36394c0ea57163911b0558c6) element that specifies a revision made by an application instance in a collaborative session.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ClientRevisionList">
2.   <xsd:sequence>
3.     <xsd:element name="client" type="CT_ClientRevision" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.5](#Section_e5047fb05d6d421fbfe9ce8cd549843f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e26a765990dd41a09f553f34da837535"></a><a id="_Toc174685984"></a>CT_RevisionInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/10/main

*Referenced by: *[revInfo](#Section_2f9b9e78b54442858bcdf797766e3aea)

<a id="CC_63f5c8af000000000000000000000000"></a>A complex type that specifies information about the revisions made to a document.

*Child Elements:*

<a id="CC_3cb13c75000000000000000000000000"></a>__revLst: __A [CT_ClientRevisionList](#Section_fdacf9e7c8aa4eb4be0270ed3f5d0bd8) element that specifies a list of revisions made to the document.

<a id="CC_0bc8a432000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the revision information will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_RevisionInfo">
2.   <xsd:sequence>
3.     <xsd:element name="revLst" type="CT_ClientRevisionList" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6. </xsd:complexType>

See section [5.5](#Section_e5047fb05d6d421fbfe9ce8cd549843f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
