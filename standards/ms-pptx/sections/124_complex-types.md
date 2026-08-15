<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_786f0b374aae44aebb81f7e785b8c09e"></a><a id="_Toc174686139"></a>CT_CommentReplyV2Changes

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/06/main/command

*Referenced by: *[CT_CommentV2Changes](#Section_824ea50e3cc444249549e64c4dcb576e)

<a id="CC_d4582fae000000000000000000000000"></a>A complex type that specifies information about edits to a comment reply.

*Child Elements:*

<a id="CC_79a82c81000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes. 

<a id="CC_d3709037000000000000000000000000"></a>__pc2:cmRplyMkLst: __A [CT_CommentReplyV2MonikerList](#Section_3cf43a62498b407eb6ea2c3243203c8a) element that specifies a content moniker that identifies the comment reply that was edited.

<a id="CC_be084039000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to the comment reply change descriptor will be stored in the extension list.

*Attributes:*

<a id="CC_56c7b7ec000000000000000000000000"></a>__chg: __An [ST_CommentReplyV2ChangeBits](#Section_8ef8f09797104e4db72c7677c47993ec) attribute that specifies the types of edits made to the comment reply.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentReplyV2Changes">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element ref="pc2:cmRplyMkLst" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
6.   </xsd:sequence>
7.   <xsd:attribute name="chg" type="ST_CommentReplyV2ChangeBits" use="required"/>
8. </xsd:complexType>

See section [5.18](#Section_7501f64409804b9fad3cb827d9f74501) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_824ea50e3cc444249549e64c4dcb576e"></a><a id="_Toc174686140"></a>CT_CommentV2Changes

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/06/main/command

*Referenced by: *[cmChg](#Section_8b54819d65774fda9bf1d5bfaeefc29c)

<a id="CC_57396594000000000000000000000000"></a>A complex type that specifies information about edits to a comment.

*Child Elements:*

<a id="CC_76a6cddb000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes.

<a id="CC_4c834fed000000000000000000000000"></a>__pc2:cmMkLst: __A [CT_CommentV2MonikerList](#Section_6ae762ceb7044b75a574ea562ce0579a) element that specifies a content moniker that identifies the edited comment.

<a id="CC_eab43e44000000000000000000000000"></a>__cmRplyChg: __A [CT_CommentReplyV2Changes](#Section_786f0b374aae44aebb81f7e785b8c09e) element that specifies the edits made to a reply on the comment.

<a id="CC_d1043cb2000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to the comment change descriptor will be stored in the extension list.

*Attributes:*

<a id="CC_7f0dcf2b000000000000000000000000"></a>__chg: __An [ST_CommentV2ChangeBits](#Section_c0d3f5ec1a044f61b1609880ddf3b6c9) attribute that specifies the types of edits made to the comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentV2Changes">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element ref="pc2:cmMkLst" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="cmRplyChg" type="CT_CommentReplyV2Changes" minOccurs="0" maxOccurs="unbounded"/>
6.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
7.   </xsd:sequence>
8.   <xsd:attribute name="chg" type="ST_CommentV2ChangeBits" use="required"/>
9. </xsd:complexType>

See section [5.18](#Section_7501f64409804b9fad3cb827d9f74501) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
