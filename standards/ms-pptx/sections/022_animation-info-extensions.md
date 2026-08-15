<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Animation Info Extensions -->

### Animation Info Extensions


The __sld__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.38), the __sldLayout__ element ([ISO/IEC29500-1:2016] section 19.3.1.39), and the __sldMaster__ element ([ISO/IEC29500-1:2016] section 19.3.1.42) are extended by the addition of an __AlternateContent __child element ([[ISO/IEC29500-3:2015]](https://go.microsoft.com/fwlink/?linkid=861154) section 7.5), whose structure is specified in the following table.	

AlternateContent components

Child element

Choice: http://schemas.microsoft.com/office/powerpoint/2010/main

__timing __([ISO/IEC29500-1:2016] section 19.3.1.48)

Fallback

__timing __([ISO/IEC29500-1:2016] section 19.3.1.48)

The __tgtEl __descendant__ __element ([ISO/IEC29500-1:2016] section 19.5.81) of the __timing__ element is extended by the addition of the following child elements to the __xsd:choice__ content model of the __CT_TLTimeTargetElement__ complex type ([ISO/IEC29500-1:2016] section A.3): __bmkTgt__ (section [2.3.1.1](#Section_7a7c9c0b9ceb4cac909fbd57f052c863)).

The __cTn __descendant__ __element ([ISO/IEC29500-1:2016] section 19.5.33) of the __timing__ element is extended by the addition of the following attribute to the __CT_TLCommonTimeNodeData__ complex type ([ISO/IEC29500-1:2016] section A.3): __presetBounceEnd __(section [2.3.2.4](#Section_55d9bdbe840f4da480ede3248518ff84)).

The __anim __descendant__ __element ([ISO/IEC29500-1:2016] section 19.5.1) of the __timing__ element is extended by the addition of the following attribute to the __CT_TLAnimateBehavior__ complex type ([ISO/IEC29500-1:2016] section A.3): __bounceEnd__ (section [2.3.2.1](#Section_1a4ace6fc76241f2870750220fc6cd9c)).

The __animMotion __descendant__ __element ([ISO/IEC29500-1:2016] section 19.5.4) of the __timing__ element is extended by the addition of the following attribute to the __CT_TLAnimateMotionBehavior__ complex type ([ISO/IEC29500-1:2016] section A.3): __bounceEnd __(section 2.3.2.1).

The __animRot __descendant__ __element ([ISO/IEC29500-1:2016] section 19.5.5) of the __timing__ element is extended by the addition of the following attribute to the __CT_TLAnimateRotationBehavior__ complex type ([ISO/IEC29500-1:2016] section A.3): __bounceEnd __(section 2.3.2.1).

The __animScale __descendant__ __element ([ISO/IEC29500-1:2016] section 19.5.6) of the __timing__ element is extended by the addition of the following attribute to the __CT_TLAnimateScaleBehavior__ complex type ([ISO/IEC29500-1:2016] section A.3): __bounceEnd __(section 2.3.2.1).
