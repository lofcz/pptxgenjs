<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_30fd68c67eb5479cacf773632431b459"></a><a id="_Toc174686109"></a>ST_AuthorId

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_ReactionInstance](#Section_ecc60fbd0a524f9dbb65c2dca088824d), [CT_TaskAssignUnassignUser](#Section_a53798916a5b471d95281a86bcc42100), [CT_Author](#Section_aaddcddb47d6434fab9c9feca81ff776), [CT_CommentReply](#Section_bcc2b4ae75714ecc8e94982f69f793db), [CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54), [ST_AuthorIdList](#Section_4b4828f373284cbdb046a410870e05bb)

<a id="CC_825e6e50000000000000000000000000"></a>A simple type that specifies the ID of an author. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_AuthorId">
2.   <xsd:restriction base="s:ST_Guid"/>
3. </xsd:simpleType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_4b4828f373284cbdb046a410870e05bb"></a><a id="_Toc174686110"></a>ST_AuthorIdList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54)

<a id="CC_3aefd692000000000000000000000000"></a>A simple type that specifies a list of author IDs.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_AuthorIdList">
2.   <xsd:list itemType="ST_AuthorId"/>
3. </xsd:simpleType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f0ba269321184d2182aabab8680c5cde"></a><a id="_Toc174686111"></a>ST_CommentId

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_CommentReply](#Section_bcc2b4ae75714ecc8e94982f69f793db), [CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54)

<a id="CC_0f27dbb8000000000000000000000000"></a>A simple type that specifies the ID of a comment or a comment reply.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentId">
2.   <xsd:restriction base="s:ST_Guid"/>
3. </xsd:simpleType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_bd806e3a96cf43aa961881b317c34c61"></a><a id="_Toc174686112"></a>ST_CommentStatus

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/8/main

*Referenced by: *[CT_CommentReply](#Section_bcc2b4ae75714ecc8e94982f69f793db), [CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54)

<a id="CC_b886a1de000000000000000000000000"></a>A simple type that specifies the status of a comment or comment reply.

Value

Meaning

active

<a id="CC_dba9596a000000000000000000000000"></a>Comment is in active status.

resolved

<a id="CC_076bb6a8000000000000000000000000"></a>Comment is in resolved status.

closed

<a id="CC_d52b5cc2000000000000000000000000"></a>Comment is in closed status.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentStatus">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="active"/>
4.     <xsd:enumeration value="resolved"/>
5.     <xsd:enumeration value="closed"/>
6.   </xsd:restriction>
7. </xsd:simpleType>

See section [5.14](#Section_af0dc8d7ee58435b80fb72f2b351b689) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
