<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_6a5a9a7a8f4f4c3d929056d896e849e7"></a><a id="_Toc174686142"></a>ST_CommentReplyV2ChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/06/main/command

*Referenced by: *[ST_CommentReplyV2ChangeBits](#Section_8ef8f09797104e4db72c7677c47993ec)

<a id="CC_bd51cb77000000000000000000000000"></a>A simple type specifying the edit made to the comment reply.

Value

Meaning

add

<a id="CC_6fdccb92000000000000000000000000"></a>Comment Reply: Add

del

<a id="CC_286056f7000000000000000000000000"></a>Comment Reply: Delete

mod

<a id="CC_fd449b55000000000000000000000000"></a>Comment Reply: Modify

modRxn

<a id="CC_72bec488000000000000000000000000"></a>Comment Reply Reaction: Modify

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentReplyV2ChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="add"/>
4.     <xsd:enumeration value="del"/>
5.     <xsd:enumeration value="mod"/>
6.     <xsd:enumeration value="modRxn"/>
7.   </xsd:restriction>
8. </xsd:simpleType>

See section [5.18](#Section_7501f64409804b9fad3cb827d9f74501) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_8ef8f09797104e4db72c7677c47993ec"></a><a id="_Toc174686143"></a>ST_CommentReplyV2ChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/06/main/command

*Referenced by: *[CT_CommentReplyV2Changes](#Section_786f0b374aae44aebb81f7e785b8c09e)

<a id="CC_ba74749c000000000000000000000000"></a>A simple type specifying a list of changes to a comment reply

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentReplyV2ChangeBits">
2.   <xsd:list itemType="ST_CommentReplyV2ChangeBit"/>
3. </xsd:simpleType>

See section [5.18](#Section_7501f64409804b9fad3cb827d9f74501) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_4221fa922b914c5cb2f5a34459d902d0"></a><a id="_Toc174686144"></a>ST_CommentV2ChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/06/main/command

*Referenced by: *[ST_CommentV2ChangeBits](#Section_c0d3f5ec1a044f61b1609880ddf3b6c9)

<a id="CC_288192f0000000000000000000000000"></a>A simple type specifying the edit made to the comment.

Value

Meaning

add

<a id="CC_fabbac9d000000000000000000000000"></a>Comment: Add

del

<a id="CC_e58107c8000000000000000000000000"></a>Comment: Delete

mod

<a id="CC_fab6ac99000000000000000000000000"></a>Comment: Modify

modTsk

<a id="CC_20f81f63000000000000000000000000"></a>Comment Task: Modify

modRxn

<a id="CC_37c71f58000000000000000000000000"></a>Comment Reaction: Modify

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentV2ChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="add"/>
4.     <xsd:enumeration value="del"/>
5.     <xsd:enumeration value="mod"/>
6.     <xsd:enumeration value="modTsk"/>
7.     <xsd:enumeration value="modRxn"/>
8.   </xsd:restriction>
9. </xsd:simpleType>

See section [5.18](#Section_7501f64409804b9fad3cb827d9f74501) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c0d3f5ec1a044f61b1609880ddf3b6c9"></a><a id="_Toc174686145"></a>ST_CommentV2ChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/06/main/command

*Referenced by: *[CT_CommentV2Changes](#Section_824ea50e3cc444249549e64c4dcb576e)

<a id="CC_e95e08d2000000000000000000000000"></a>A simple type specifying a list of changes to a comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentV2ChangeBits">
2.   <xsd:list itemType="ST_CommentV2ChangeBit"/>
3. </xsd:simpleType>

See section [5.18](#Section_7501f64409804b9fad3cb827d9f74501) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
