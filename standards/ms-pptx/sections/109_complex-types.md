<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_aaddcddb47d6434fab9c9feca81ff776"></a><a id="_Toc174686100"></a>CT_Author

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_AuthorList](#Section_6803a0b3b5be48d681a15f4d1b9aca9e)

<a id="CC_5df069eb000000000000000000000000"></a>A complex type that specifies information about an author.

*Child Elements:*

<a id="CC_96f7b8cd000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to author will be stored in the extension list.

*Attributes:*

<a id="CC_4ac59b1e000000000000000000000000"></a>__id: __An [ST_AuthorId](#Section_30fd68c67eb5479cacf773632431b459) attribute that specifies the ID of the author.

<a id="CC_b26ddc18000000000000000000000000"></a>__name: __An xsd:string ([[XMLSCHEMA2]](https://go.microsoft.com/fwlink/?LinkId=90610) section 3.2.1) attribute that specifies name of the author.

<a id="CC_4b316295000000000000000000000000"></a>__initials: __An xsd:string ([XMLSCHEMA2] section 3.2.1) attribute that specifies initials of the author.

<a id="CC_6aced33d000000000000000000000000"></a>__userId: __An xsd:string ([XMLSCHEMA2] section 3.2.1) attribute that specifies a unique user id for the author as specified in __CT_PresenceInfo__ (section [2.4.3.7](#Section_04553ed32f834ec38e2ed41c46979e94)).

<a id="CC_bd8f2afc000000000000000000000000"></a>__providerId: __An xsd:string ([XMLSCHEMA2] section 3.2.1) attribute that specifies the identity provider that produced the userId attribute as specified in __CT_PresenceInfo__ (section 2.4.3.7).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Author">
2.   <xsd:sequence>
3.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="id" type="ST_AuthorId" use="required"/>
6.   <xsd:attribute name="name" type="xsd:string" use="required"/>
7.   <xsd:attribute name="initials" type="xsd:string" use="optional"/>
8.   <xsd:attribute name="userId" type="xsd:string" use="required"/>
9.   <xsd:attribute name="providerId" type="xsd:string" use="required"/>
10. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_6803a0b3b5be48d681a15f4d1b9aca9e"></a><a id="_Toc174686101"></a>CT_AuthorList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[authorLst](#Section_8df7f6eda77c4be9968233a696291737)

<a id="CC_80349254000000000000000000000000"></a>A complex type that specifies a list of authors.

*Child Elements:*

<a id="CC_4949aa46000000000000000000000000"></a>__author: __A [CT_Author](#Section_aaddcddb47d6434fab9c9feca81ff776) element that specifies an author.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_AuthorList">
2.   <xsd:sequence>
3.     <xsd:element name="author" type="CT_Author" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_161bc2c998fc46b7852bba7ee77e2e54"></a><a id="_Toc174686102"></a>CT_Comment

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_CommentList](#Section_257fcc752a1b4161a7112da453474b0f)

<a id="CC_13246376000000000000000000000000"></a>A complex type that specifies a comment.

*Child Elements:*

<a id="CC_8c44f924000000000000000000000000"></a>__pc:sldMkLst: __A [CT_SlideMonikerList](#Section_d50cf27ff9d4482b9c44076b2576ab75) element that specifies a content moniker that identifies the slide to which the comment is anchored.

<a id="CC_f878e853000000000000000000000000"></a>__ac:deMkLst: __An ac:CT_DrawingElementMonikerList ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.20) element that specifies a content moniker that identifies the drawing element to which the comment is anchored.

<a id="CC_3418bcb2000000000000000000000000"></a>__ac:txMkLst: __An ac:CT_TextCharRangeMonikerList ([MS-ODRAWXML] section 2.29.3.21) element that specifies a content moniker that identifies the text character range to which the comment is anchored.

<a id="CC_7f607720000000000000000000000000"></a>__unknownAnchor: __A [CT_CommentUnknownAnchor](#Section_a9085f481f4f4a43ac93ecbc91ae1af6) element that specifies an unknown anchor to which the comment is anchored. 

<a id="CC_aca2c32f000000000000000000000000"></a>__pos: __An a:CT_Point2D ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) element that specifies the position of the comment, relative to the top-left corner of the first object to which the comment is anchored.

<a id="CC_150ec614000000000000000000000000"></a>__replyLst: __A [CT_CommentReplyList](#Section_a745f2b0708949049fa3587a094bd136) element that specifies the list of replies to the comment.

__txBody: __An a:CT_TextBody ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) element that specifies the text of a comment or a comment reply.

__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies a list of extensions for a comment or a comment reply.

*Attributes:*

__id: __An [ST_CommentId](#Section_f0ba269321184d2182aabab8680c5cde) attribute that specifies the ID of a comment or a comment reply.

__authorId: __An [ST_AuthorId](#Section_30fd68c67eb5479cacf773632431b459) attribute that specifies the author ID of a comment or a comment reply.

__status: __An [ST_CommentStatus](#Section_bd806e3a96cf43aa961881b317c34c61) attribute that specifies the status of a comment or a comment reply.

__created: __An xsd:dateTime ([[XMLSCHEMA2]](https://go.microsoft.com/fwlink/?LinkId=90610) section 3.2.7) attribute that specifies the date time when the comment or comment reply is created.

<a id="CC_2c5ce998000000000000000000000000"></a>__startDate: __An xsd:dateTime ([XMLSCHEMA2] section 3.2.7) attribute that specifies start date of the comment.

<a id="CC_82c39fa6000000000000000000000000"></a>__dueDate: __A xsd:dateTime ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.7) attribute that specifies due date of the comment.

<a id="CC_22b6db6e000000000000000000000000"></a>__assignedTo: __An [ST_AuthorIdList](#Section_4b4828f373284cbdb046a410870e05bb) attribute that specifies a list of authors to whom the comment is assigned.

<a id="CC_38cba84f000000000000000000000000"></a>__complete: __An s:ST_PositiveFixedPercentage ([ISO/IEC-29500-4] section A.8.9) attribute that specifies the completion percentage of the comment.

<a id="CC_b28a5891000000000000000000000000"></a>__title: __A xsd:string ([XMLSCHEMA2/2] section 3.2.1) attribute that specifies the title for a comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Comment">
2.   <xsd:sequence>
3.     <xsd:group ref="EG_CommentAnchor" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="pos" type="a:CT_Point2D" minOccurs="0" maxOccurs="1"/>
5.     <xsd:element name="replyLst" type="CT_CommentReplyList" minOccurs="0" maxOccurs="1"/>
6.     <xsd:group ref="EG_CommentProperties" minOccurs="1" maxOccurs="1"/>
7.   </xsd:sequence>
8.   <xsd:attributeGroup ref="AG_CommentProperties"/>
9.   <xsd:attribute name="startDate" type="xsd:dateTime" use="optional"/>
10.   <xsd:attribute name="dueDate" type="xsd:dateTime" use="optional"/>
11.   <xsd:attribute name="assignedTo" type="ST_AuthorIdList" use="optional" default=""/>
12.   <xsd:attribute name="complete" type="s:ST_PositiveFixedPercentage" default="0%" use="optional"/>
13.   <xsd:attribute name="title" type="xsd:string" use="optional" default=""/>
14. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_257fcc752a1b4161a7112da453474b0f"></a><a id="_Toc174686103"></a>CT_CommentList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[cmLst](#Section_653f8a0b01d4446394d42c4fc2fe6bb2)

<a id="CC_f8370db5000000000000000000000000"></a>A complex type that specifies a list of comments.

*Child Elements:*

<a id="CC_0642399c000000000000000000000000"></a>__cm: __A [CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54) element that specifies a comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentList">
2.   <xsd:sequence>
3.     <xsd:element name="cm" type="CT_Comment" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7083d007807f4b0eb97da331d3fc2b82"></a><a id="_Toc174686104"></a>CT_CommentRelationship

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[commentRel](#Section_c0f70c68e456452bb6fe6ff6bc36bd90)

<a id="CC_c4c61351000000000000000000000000"></a>A complex type that specifies a relationship to __Comment Part__ (section [2.1.5](#Section_b85a9293bdca4c6ba5548f3918db9791)).

*Attributes:*

<a id="CC_76ba8f65000000000000000000000000"></a>__r:id: __A r:ST_RelationshipId ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.8.8) attribute that specifies the ID of the relationship.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentRelationship">
2.   <xsd:attribute ref="r:id" use="required"/>
3. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_bcc2b4ae75714ecc8e94982f69f793db"></a><a id="_Toc174686105"></a>CT_CommentReply

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_CommentReplyList](#Section_a745f2b0708949049fa3587a094bd136)

<a id="CC_7a81638d000000000000000000000000"></a>A complex type that specifies a comment reply.

*Child Elements:*

<a id="CC_85b99a19000000000000000000000000"></a>__txBody: __An a:CT_TextBody ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) element that specifies the text of a comment or a comment reply.

<a id="CC_c7c08fb5000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies a list of extensions for a comment or a comment reply.

*Attributes:*

<a id="CC_3005ca44000000000000000000000000"></a>__id: __An [ST_CommentId](#Section_f0ba269321184d2182aabab8680c5cde) attribute that specifies the ID of a comment or a comment reply.

<a id="CC_06ca281b000000000000000000000000"></a>__authorId: __An [ST_AuthorId](#Section_30fd68c67eb5479cacf773632431b459) attribute that specifies the author ID of a comment or a comment reply.

<a id="CC_3cff32ae000000000000000000000000"></a>__status: __An [ST_CommentStatus](#Section_bd806e3a96cf43aa961881b317c34c61) attribute that specifies the status of a comment or a comment reply.

<a id="CC_ec6ab0b4000000000000000000000000"></a>__created: __An xsd:dateTime ([[XMLSCHEMA2]](https://go.microsoft.com/fwlink/?LinkId=90610) section 3.2.7) attribute that specifies the date time when the comment or comment reply is created.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentReply">
2.   <xsd:sequence>
3.     <xsd:group ref="EG_CommentProperties" minOccurs="1" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attributeGroup ref="AG_CommentProperties"/>
6. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a745f2b0708949049fa3587a094bd136"></a><a id="_Toc174686106"></a>CT_CommentReplyList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54)

<a id="CC_d92001b8000000000000000000000000"></a>A complex type that specifies a list of comment replies.

*Child Elements:*

<a id="CC_2b097fb2000000000000000000000000"></a>__reply: __A [CT_CommentReply](#Section_bcc2b4ae75714ecc8e94982f69f793db) element that specifies a comment reply.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentReplyList">
2.   <xsd:sequence>
3.     <xsd:element name="reply" type="CT_CommentReply" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a9085f481f4f4a43ac93ecbc91ae1af6"></a><a id="_Toc174686107"></a>CT_CommentUnknownAnchor

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54)

<a id="CC_11eb69ad000000000000000000000000"></a>A complex type that specifies an unknown comment anchor type for future extension.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentUnknownAnchor"/>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
