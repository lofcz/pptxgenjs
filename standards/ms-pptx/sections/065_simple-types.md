<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_65206abbcfaf489390b74674660c6933"></a><a id="_Toc174685986"></a>ST_ClientID

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/10/main

*Referenced by: *[CT_ClientRevision](#Section_bda2442f36394c0ea57163911b0558c6)

<a id="CC_b67af6d5000000000000000000000000"></a>A simple type that specifies a unique identifier for an application instance participating in a collaborative session.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_ClientID">
2.   <xsd:restriction base="xsd:string"/>
3. </xsd:simpleType>

See section [5.5](#Section_e5047fb05d6d421fbfe9ce8cd549843f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_84bd8c757410499e9a2ce7d3ad3b7c47"></a><a id="_Toc174685987"></a>ST_ClientRevisionNumber

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/10/main

*Referenced by: *[CT_ClientRevision](#Section_bda2442f36394c0ea57163911b0558c6)

<a id="CC_56cedf18000000000000000000000000"></a>A simple type that specifies an unsigned integer for uniquely identifying a revision made by a particular application instance. A client revision number MUST be a strictly increasing value, with a later revision having a greater client revision number than an earlier one. A client revision number does not have to be unique across different application instances. A pair consisting of a client ID and a client revision number uniquely identifies a revision within a collaborative session.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_ClientRevisionNumber">
2.   <xsd:restriction base="xsd:unsignedInt"/>
3. </xsd:simpleType>

See section [5.5](#Section_e5047fb05d6d421fbfe9ce8cd549843f) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
