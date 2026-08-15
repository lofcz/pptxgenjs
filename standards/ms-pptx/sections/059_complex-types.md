<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_41ca8fbfefc849ac8a327bd0856544bd"></a><a id="_Toc174685974"></a>CT_MorphTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/09/main

*Referenced by: *[morph](#Section_68d26d78f7f547ab835d4e6c82ff39f0)

<a id="CC_530ae682000000000000000000000000"></a>A complex type that specifies the parameters of a morph transition.

*Attributes:*

<a id="CC_936f27be000000000000000000000000"></a>__option: __An [ST_TransitionMorphOption](#Section_22e711ee35a742cbb87c1c277ec11070) attribute that specifies the level of detail for matching objects on the slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MorphTransition">
2.   <xsd:attribute name="option" type="ST_TransitionMorphOption" use="required"/>
3. </xsd:complexType>

See section [5.4](#Section_a54fd7b704d64d16bbddb20b2b99578c) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
