<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_df4734f0927944ac8fbbfcd93172c0bc"></a><a id="_Toc174686055"></a>ST_CommentAuthorChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[ST_CommentAuthorChangeBits](#Section_e372b4c65e934b0da12d589cbf478411)

<a id="CC_dfd2b85c000000000000000000000000"></a>A simple type specifying the edit made to the comment author.

Value

Meaning

add

<a id="CC_1130ab35000000000000000000000000"></a>Comment Author: Add

del

<a id="CC_c9b4369a000000000000000000000000"></a>Comment Author: Delete

mod

<a id="CC_13faa88c000000000000000000000000"></a>Comment Author: Modify

replId

<a id="CC_741bd148000000000000000000000000"></a>Comment Author ID: Replace

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentAuthorChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="add"/>
4.     <xsd:enumeration value="del"/>
5.     <xsd:enumeration value="mod"/>
6.     <xsd:enumeration value="replId"/>
7.   </xsd:restriction>
8. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e372b4c65e934b0da12d589cbf478411"></a><a id="_Toc174686056"></a>ST_CommentAuthorChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_CommentAuthorChanges](#Section_0ffef3dc2d754541935f3241027c8b6c)

<a id="CC_3db2b465000000000000000000000000"></a>A simple type specifying a list of changes to a comment author.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentAuthorChangeBits">
2.   <xsd:list itemType="ST_CommentAuthorChangeBit"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_784d775f18e74d75be522bef360446b9"></a><a id="_Toc174686057"></a>ST_CommentChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[ST_CommentChangeBits](#Section_d2de8b819fa04f53bb4c5ee650be8459)

<a id="CC_8fb1e2fb000000000000000000000000"></a>A simple type specifying the edit made to the comment.

Value

Meaning

add

<a id="CC_f5a96cd6000000000000000000000000"></a>Comment: Add

del

<a id="CC_aeaa6cd5000000000000000000000000"></a>Comment: Delete

mod

<a id="CC_c8156ccf000000000000000000000000"></a>Comment: Modify

replId

<a id="CC_70159a81000000000000000000000000"></a>Comment ID: Modify

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="add"/>
4.     <xsd:enumeration value="del"/>
5.     <xsd:enumeration value="mod"/>
6.     <xsd:enumeration value="replId"/>
7.   </xsd:restriction>
8. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_d2de8b819fa04f53bb4c5ee650be8459"></a><a id="_Toc174686058"></a>ST_CommentChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_CommentChanges](#Section_60f3f3c7c57e441a8680b090eb45eadd)

<a id="CC_df48e277000000000000000000000000"></a>A simple type specifying a list of changes to a comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CommentChangeBits">
2.   <xsd:list itemType="ST_CommentChangeBit"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_5f1ede0b7f9440f7949354ef37d2e36e"></a><a id="_Toc174686059"></a>ST_CreationId

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_SlideMoniker](#Section_856b398e1b9946c7aba1d26043ba7968), [CT_MainMasterMoniker](#Section_303c23565a324aafa02b04c463768dd2), [CT_SlideLayoutMoniker](#Section_43403201bae74d5bbcbde2b0d6a3b08a)

<a id="CC_82e6a908000000000000000000000000"></a>A simple type that specifies the creation ID of a slide, master slide, or slide layout (see section [2.3.1.4](#Section_82a107ddbeeb46468bd248f433e1d62e)).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_CreationId">
2.   <xsd:restriction base="xsd:unsignedInt"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_0d58851d959e43aebd44cc9a682b4340"></a><a id="_Toc174686060"></a>ST_DocumentChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[ST_DocumentChangeBits](#Section_a7336ccea9a0488ebfb852540c0bd624)

<a id="CC_9cb82b3c000000000000000000000000"></a>A simple type specifying the edit made to the document.

Value

Meaning

undo

<a id="CC_2a51da99000000000000000000000000"></a>Undo

redo

<a id="CC_2a5ada92000000000000000000000000"></a>Redo

ext

<a id="CC_6ca82439000000000000000000000000"></a>External

custSel

<a id="CC_5f9fc1b3000000000000000000000000"></a>Custom Selection

mod

<a id="CC_4241da91000000000000000000000000"></a>Document: Modify

addSld

<a id="CC_c5a56a8c000000000000000000000000"></a>Add Slide

delSld

<a id="CC_daf80fff000000000000000000000000"></a>Delete Slide

modSld

<a id="CC_c4326c20000000000000000000000000"></a>Modify Slide

sldOrd

<a id="CC_a8816cc8000000000000000000000000"></a>Modify Slide Order

addMainMaster

<a id="CC_96e013c2000000000000000000000000"></a>Add Main Slide Master

delMainMaster

<a id="CC_3bc58bca000000000000000000000000"></a>Delete Main Slide Master

modMainMaster

<a id="CC_867ba84d000000000000000000000000"></a>Modify Main Slide Master

mainMasterOrd

<a id="CC_a4e50498000000000000000000000000"></a>Reorder Main Slide Master

addSection

<a id="CC_4a9c7548000000000000000000000000"></a>Add Section

delSection

<a id="CC_0a11cb57000000000000000000000000"></a>Delete Section

modSection

<a id="CC_1bc7a954000000000000000000000000"></a>Modify Section

addCmAuthor

<a id="CC_3e17a62d000000000000000000000000"></a>Add Comment Author

delCmAuthor

<a id="CC_ef58fcee000000000000000000000000"></a>Delete Comment Author

modCmAuthor

<a id="CC_0f44db11000000000000000000000000"></a>Modify Comment Author

replTag

<a id="CC_1f527785000000000000000000000000"></a>Replace String Tag

delTag

<a id="CC_38c61002000000000000000000000000"></a>Delete String Tag

addCustShow

<a id="CC_4684ac97000000000000000000000000"></a>Add Custom Show

delCustShow

<a id="CC_9c03fda8000000000000000000000000"></a>Delete Custom Show

modCustShow

<a id="CC_1391dc7b000000000000000000000000"></a>Modify Custom Show

modNotesMaster

<a id="CC_3c8e14d3000000000000000000000000"></a>Modify Notes Master

modHandout

<a id="CC_1b26f26e000000000000000000000000"></a>Modify Handouts Master

modShowInfo

<a id="CC_6ed46118000000000000000000000000"></a>Modify Show Info

addOsfTaskPaneApp

<a id="CC_612b3810000000000000000000000000"></a>Add Task Pane App Content

delOsfTaskPaneApp

<a id="CC_357836aa000000000000000000000000"></a>Delete Task Pane App Content

setSldSz

<a id="CC_707e947e000000000000000000000000"></a>Set Slide Size

modRtl

<a id="CC_38c56c08000000000000000000000000"></a>Modify Right-to-Left properties

modChgInfo

<a id="CC_0140ce11000000000000000000000000"></a>Modify Changes Info

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_DocumentChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="undo"/>
4.     <xsd:enumeration value="redo"/>
5.     <xsd:enumeration value="ext"/>
6.     <xsd:enumeration value="custSel"/>
7.     <xsd:enumeration value="mod"/>
8.     <xsd:enumeration value="addSld"/>
9.     <xsd:enumeration value="delSld"/>
10.     <xsd:enumeration value="modSld"/>
11.     <xsd:enumeration value="sldOrd"/>
12.     <xsd:enumeration value="addMainMaster"/>
13.     <xsd:enumeration value="delMainMaster"/>
14.     <xsd:enumeration value="modMainMaster"/>
15.     <xsd:enumeration value="mainMasterOrd"/>
16.     <xsd:enumeration value="addSection"/>
17.     <xsd:enumeration value="delSection"/>
18.     <xsd:enumeration value="modSection"/>
19.     <xsd:enumeration value="addCmAuthor"/>
20.     <xsd:enumeration value="delCmAuthor"/>
21.     <xsd:enumeration value="modCmAuthor"/>
22.     <xsd:enumeration value="replTag"/>
23.     <xsd:enumeration value="delTag"/>
24.     <xsd:enumeration value="addCustShow"/>
25.     <xsd:enumeration value="delCustShow"/>
26.     <xsd:enumeration value="modCustShow"/>
27.     <xsd:enumeration value="modNotesMaster"/>
28.     <xsd:enumeration value="modHandout"/>
29.     <xsd:enumeration value="modShowInfo"/>
30.     <xsd:enumeration value="addOsfTaskPaneApp"/>
31.     <xsd:enumeration value="delOsfTaskPaneApp"/>
32.     <xsd:enumeration value="setSldSz"/>
33.     <xsd:enumeration value="modRtl"/>
34.     <xsd:enumeration value="modChgInfo"/>
35.   </xsd:restriction>
36. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a7336ccea9a0488ebfb852540c0bd624"></a><a id="_Toc174686061"></a>ST_DocumentChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_DocumentChanges](#Section_6a7a3a69769f40778b40698fe00b7c52)

<a id="CC_ac79fb24000000000000000000000000"></a>A simple type specifying a list of edits to a presentation.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_DocumentChangeBits">
2.   <xsd:list itemType="ST_DocumentChangeBit"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9d3008ee8c4b4c24aad3a9a52de2add0"></a><a id="_Toc174686062"></a>ST_MainMasterChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[ST_MainMasterChangeBits](#Section_20be4decb6784f9dac4106ac802f5b04)

<a id="CC_34a2a4b1000000000000000000000000"></a>An enumeration specifying the edit made to the Main Master.

Value

Meaning

addSp

<a id="CC_bf69d745000000000000000000000000"></a>Add Shape

delSp

<a id="CC_f31f828e000000000000000000000000"></a>Delete Shape

modSp

<a id="CC_8948b759000000000000000000000000"></a>Modify Shape

spOrd

<a id="CC_66b89824000000000000000000000000"></a>Reorder Shape

new

<a id="CC_b7e78ee5000000000000000000000000"></a>New

add

<a id="CC_1478ecc9000000000000000000000000"></a>Add

del

<a id="CC_87d44a92000000000000000000000000"></a>Delete

mod

<a id="CC_87321a5d000000000000000000000000"></a>Modify

ord

<a id="CC_6eb00393000000000000000000000000"></a>Reorder

replId

<a id="CC_c2ca5197000000000000000000000000"></a>Replace ID

modTransition

<a id="CC_eaa4954e000000000000000000000000"></a>Modify Transition

modMedia

<a id="CC_d26b0309000000000000000000000000"></a>Modify Media

setBg

<a id="CC_d69b3a6e000000000000000000000000"></a>Set Background

setFolMasterAnim

<a id="CC_573db092000000000000000000000000"></a>Set Follow Master Animations

setFolMasterObjs

<a id="CC_e46cc759000000000000000000000000"></a>Set Follow Master Objects

modClrScheme

<a id="CC_e4df1e2f000000000000000000000000"></a>Modify Color Scheme

addAnim

<a id="CC_00c7371a000000000000000000000000"></a>Add Animation

delAnim

<a id="CC_d914637b000000000000000000000000"></a>Delete Animation

modAnim

<a id="CC_ec07bc06000000000000000000000000"></a>Modify Animation

replTag

<a id="CC_6b9c9bf9000000000000000000000000"></a>Replace String Tag

delTag

<a id="CC_d82a40d9000000000000000000000000"></a>Delete String Tag

setClrOvrMap

<a id="CC_2a41618b000000000000000000000000"></a>Set Color Override Map

delDesignElem

<a id="CC_165be7e0000000000000000000000000"></a>Delete Design Element

modShow

<a id="CC_da0f006a000000000000000000000000"></a>Modify Show/Hide information

addSldLayout

<a id="CC_ec767086000000000000000000000000"></a>Add Slide Layout

delSldLayout

<a id="CC_a132f5c1000000000000000000000000"></a>Delete Slide Layout

modSldLayout

<a id="CC_8afc4942000000000000000000000000"></a>Modify Slide Layout

sldLayoutOrd

<a id="CC_61534879000000000000000000000000"></a>Reorder Slide Layout

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_MainMasterChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="addSp"/>
4.     <xsd:enumeration value="delSp"/>
5.     <xsd:enumeration value="modSp"/>
6.     <xsd:enumeration value="spOrd"/>
7.     <xsd:enumeration value="new"/>
8.     <xsd:enumeration value="add"/>
9.     <xsd:enumeration value="del"/>
10.     <xsd:enumeration value="mod"/>
11.     <xsd:enumeration value="ord"/>
12.     <xsd:enumeration value="replId"/>
13.     <xsd:enumeration value="modTransition"/>
14.     <xsd:enumeration value="modMedia"/>
15.     <xsd:enumeration value="setBg"/>
16.     <xsd:enumeration value="setFolMasterAnim"/>
17.     <xsd:enumeration value="setFolMasterObjs"/>
18.     <xsd:enumeration value="modClrScheme"/>
19.     <xsd:enumeration value="addAnim"/>
20.     <xsd:enumeration value="delAnim"/>
21.     <xsd:enumeration value="modAnim"/>
22.     <xsd:enumeration value="replTag"/>
23.     <xsd:enumeration value="delTag"/>
24.     <xsd:enumeration value="setClrOvrMap"/>
25.     <xsd:enumeration value="delDesignElem"/>
26.     <xsd:enumeration value="modShow"/>
27.     <xsd:enumeration value="addSldLayout"/>
28.     <xsd:enumeration value="delSldLayout"/>
29.     <xsd:enumeration value="modSldLayout"/>
30.     <xsd:enumeration value="sldLayoutOrd"/>
31.   </xsd:restriction>
32. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_20be4decb6784f9dac4106ac802f5b04"></a><a id="_Toc174686063"></a>ST_MainMasterChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_MainMasterChanges](#Section_43853e6e564a4b8ba10a4f95b065c242)

<a id="CC_567dca46000000000000000000000000"></a>A simple type specifying a list of edits to a master slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_MainMasterChangeBits">
2.   <xsd:list itemType="ST_MainMasterChangeBit"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_234c7822f9ef4b45960c9e6226f1f334"></a><a id="_Toc174686064"></a>ST_SlideChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[ST_SlideChangeBits](#Section_1e0f8fda550244c2910b98e7cc5be149)

<a id="CC_6e56ff80000000000000000000000000"></a>A simple type specifying the edit made to the slide.

Value

Meaning

addSp

<a id="CC_9b0a6c8f000000000000000000000000"></a>Add Shape

delSp

<a id="CC_9cd5f7f4000000000000000000000000"></a>Delete Shape

modSp

<a id="CC_9e3c69e6000000000000000000000000"></a>Modify Shape

spOrd

<a id="CC_9c425052000000000000000000000000"></a>Reorder Shape

new

<a id="CC_6fbe3b2e000000000000000000000000"></a>New

add

<a id="CC_2681afc9000000000000000000000000"></a>Add

del

<a id="CC_28ad3b2e000000000000000000000000"></a>Delete

mod

<a id="CC_2953ad20000000000000000000000000"></a>Modify

ord

<a id="CC_2c23aa77000000000000000000000000"></a>Reorder

replId

<a id="CC_6281e655000000000000000000000000"></a>Replace ID

modTransition

<a id="CC_57a3bb68000000000000000000000000"></a>Modify Transition

modMedia

<a id="CC_43303a29000000000000000000000000"></a>Modify Media

setBg

<a id="CC_44bbf803000000000000000000000000"></a>Set Background

setFolMasterAnim

<a id="CC_df9f0b55000000000000000000000000"></a>Set Follow Master Animation

setFolMasterObjs

<a id="CC_de95ddc7000000000000000000000000"></a>Set Follow Master Object

modClrScheme

<a id="CC_90473c0f000000000000000000000000"></a>Modify Color Scheme

addAnim

<a id="CC_6a4b76de000000000000000000000000"></a>Add Animation

delAnim

<a id="CC_439be3d9000000000000000000000000"></a>Delete Animation

modAnim

<a id="CC_8d1e2b3b000000000000000000000000"></a>Modify Animation

replTag

<a id="CC_64fd8884000000000000000000000000"></a>Replace String Tag

delTag

<a id="CC_9d0071d2000000000000000000000000"></a>Delete String Tag

setClrOvrMap

<a id="CC_933ce46f000000000000000000000000"></a>Set Color Override map

delDesignElem

<a id="CC_31a90d3e000000000000000000000000"></a>Delete Design Element

modShow

<a id="CC_34c6e6cf000000000000000000000000"></a>Modify Show/hide info

addCm

<a id="CC_9b0f6c9f000000000000000000000000"></a>Add comment

delCm

<a id="CC_9ce0f804000000000000000000000000"></a>Delete comment

modCm

<a id="CC_9e3969f6000000000000000000000000"></a>Modify comment

chgLayout

<a id="CC_7836b6d4000000000000000000000000"></a>Change Layout

modNotes

<a id="CC_ebeaf04e000000000000000000000000"></a>Modify Speaker Notes

modNotesTx

<a id="CC_c2c7a652000000000000000000000000"></a>Modify Speaker Notes Text

setSldSyncInfo

<a id="CC_c9096ddd000000000000000000000000"></a>Set Slide Sync info

newSectionLinks

<a id="CC_e391bf12000000000000000000000000"></a>New Section Links

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_SlideChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="addSp"/>
4.     <xsd:enumeration value="delSp"/>
5.     <xsd:enumeration value="modSp"/>
6.     <xsd:enumeration value="spOrd"/>
7.     <xsd:enumeration value="new"/>
8.     <xsd:enumeration value="add"/>
9.     <xsd:enumeration value="del"/>
10.     <xsd:enumeration value="mod"/>
11.     <xsd:enumeration value="ord"/>
12.     <xsd:enumeration value="replId"/>
13.     <xsd:enumeration value="modTransition"/>
14.     <xsd:enumeration value="modMedia"/>
15.     <xsd:enumeration value="setBg"/>
16.     <xsd:enumeration value="setFolMasterAnim"/>
17.     <xsd:enumeration value="setFolMasterObjs"/>
18.     <xsd:enumeration value="modClrScheme"/>
19.     <xsd:enumeration value="addAnim"/>
20.     <xsd:enumeration value="delAnim"/>
21.     <xsd:enumeration value="modAnim"/>
22.     <xsd:enumeration value="replTag"/>
23.     <xsd:enumeration value="delTag"/>
24.     <xsd:enumeration value="setClrOvrMap"/>
25.     <xsd:enumeration value="delDesignElem"/>
26.     <xsd:enumeration value="modShow"/>
27.     <xsd:enumeration value="addCm"/>
28.     <xsd:enumeration value="delCm"/>
29.     <xsd:enumeration value="modCm"/>
30.     <xsd:enumeration value="chgLayout"/>
31.     <xsd:enumeration value="modNotes"/>
32.     <xsd:enumeration value="modNotesTx"/>
33.     <xsd:enumeration value="setSldSyncInfo"/>
34.     <xsd:enumeration value="newSectionLinks"/>
35.   </xsd:restriction>
36. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_1e0f8fda550244c2910b98e7cc5be149"></a><a id="_Toc174686065"></a>ST_SlideChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_SlideChanges](#Section_f30be7c1cdf8464e860f86add89a5734)

<a id="CC_38f6c10b000000000000000000000000"></a>A simple type specifying a list of edits to a slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_SlideChangeBits">
2.   <xsd:list itemType="ST_SlideChangeBit"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_22b81ead9a1548c78ba90f12d358a566"></a><a id="_Toc174686066"></a>ST_SlideLayoutChangeBit

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[ST_SlideLayoutChangeBits](#Section_c54bc9dd74564451ace43e49778fcbb6)

<a id="CC_5aa773cc000000000000000000000000"></a>An enumeration specifying the type of edit made to a slide layout.

Value

Meaning

addSp

<a id="CC_a7438099000000000000000000000000"></a>Shape: Add

delSp

<a id="CC_0b24809a000000000000000000000000"></a>Shape: Delete

modSp

<a id="CC_dadf8094000000000000000000000000"></a>Shape: Modify

spOrd

<a id="CC_53c361e8000000000000000000000000"></a>Shape: Modify Order

new

<a id="CC_3a91cf61000000000000000000000000"></a>Slide: New

add

<a id="CC_3d2dcf60000000000000000000000000"></a>Slide: Add

del

<a id="CC_f62ecf61000000000000000000000000"></a>Slide: Delete

mod

<a id="CC_c5e9cf5b000000000000000000000000"></a>Slide: Modify

ord

<a id="CC_af1fcf76000000000000000000000000"></a>Slide: Reorder

replId

<a id="CC_bf540718000000000000000000000000"></a>Slide: Replace ID

modTransition

<a id="CC_ef4e12cf000000000000000000000000"></a>Slide: Modify Transition

modMedia

<a id="CC_3313ef56000000000000000000000000"></a>Slide: Modify Media

setBg

<a id="CC_31253ee5000000000000000000000000"></a>Slide: Set Background

setFolMasterAnim

<a id="CC_582dd028000000000000000000000000"></a>Slide: Set Follow Master Animations

setFolMasterObjs

<a id="CC_82d95e3a000000000000000000000000"></a>Slide: Set Follow Master Objects

modClrScheme

<a id="CC_87e3e515000000000000000000000000"></a>Slide: Modify Color Scheme

addAnim

<a id="CC_949eadab000000000000000000000000"></a>Slide: Add Animation

delAnim

<a id="CC_7093ae8e000000000000000000000000"></a>Slide: Delete Animation

modAnim

<a id="CC_9002ad58000000000000000000000000"></a>Slide: Modify Animation

replTag

<a id="CC_06780715000000000000000000000000"></a>Slide: Replace String Tag

delTag

<a id="CC_9e21abef000000000000000000000000"></a>Slide: Delete String Tag

setClrOvrMap

<a id="CC_6f7dd790000000000000000000000000"></a>Slide: Set Color override mapping

delDesignElem

<a id="CC_5ae9f45c000000000000000000000000"></a>Slide: Delete Design Element

modShow

<a id="CC_c19e4cdc000000000000000000000000"></a>Slide: Modify show/hide properties

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_SlideLayoutChangeBit">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="addSp"/>
4.     <xsd:enumeration value="delSp"/>
5.     <xsd:enumeration value="modSp"/>
6.     <xsd:enumeration value="spOrd"/>
7.     <xsd:enumeration value="new"/>
8.     <xsd:enumeration value="add"/>
9.     <xsd:enumeration value="del"/>
10.     <xsd:enumeration value="mod"/>
11.     <xsd:enumeration value="ord"/>
12.     <xsd:enumeration value="replId"/>
13.     <xsd:enumeration value="modTransition"/>
14.     <xsd:enumeration value="modMedia"/>
15.     <xsd:enumeration value="setBg"/>
16.     <xsd:enumeration value="setFolMasterAnim"/>
17.     <xsd:enumeration value="setFolMasterObjs"/>
18.     <xsd:enumeration value="modClrScheme"/>
19.     <xsd:enumeration value="addAnim"/>
20.     <xsd:enumeration value="delAnim"/>
21.     <xsd:enumeration value="modAnim"/>
22.     <xsd:enumeration value="replTag"/>
23.     <xsd:enumeration value="delTag"/>
24.     <xsd:enumeration value="setClrOvrMap"/>
25.     <xsd:enumeration value="delDesignElem"/>
26.     <xsd:enumeration value="modShow"/>
27.   </xsd:restriction>
28. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c54bc9dd74564451ace43e49778fcbb6"></a><a id="_Toc174686067"></a>ST_SlideLayoutChangeBits

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_SlideLayoutChanges](#Section_35d5a88579f54ae2b5f32b8884286c44)

<a id="CC_c1a468a0000000000000000000000000"></a>A simple type specifying a list of changes to a slide layout.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_SlideLayoutChangeBits">
2.   <xsd:list itemType="ST_SlideLayoutChangeBit"/>
3. </xsd:simpleType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
