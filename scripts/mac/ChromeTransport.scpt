FasdUAS 1.101.10   ��   ��    k             i         I      �� 	���� ,0 applicationisrunning ApplicationIsRunning 	  
�� 
 o      ���� 0 appname appName��  ��    k            O        r        I   �� ��
�� .coredoexnull���     ****  l    ����  6      2   ��
�� 
prcs  =       1   	 ��
�� 
pnam  o    ���� 0 appname appName��  ��  ��    o      ���� $0 appnameisrunning appNameIsRunning  m       �                                                                                  sevs  alis    \  Macintosh HD                   BD ����System Events.app                                              ����            ����  
 cu             CoreServices  0/:System:Library:CoreServices:System Events.app/  $  S y s t e m   E v e n t s . a p p    M a c i n t o s h   H D  -System/Library/CoreServices/System Events.app   / ��     ��  L       o    ���� $0 appnameisrunning appNameIsRunning��        l     ��������  ��  ��        l     ��������  ��  ��         i     ! " ! I      �������� "0 getcurrenttrack GetCurrentTrack��  ��   " Z     � # $�� % # I     �� &���� ,0 applicationisrunning ApplicationIsRunning &  '�� ' m     ( ( � ) )  G o o g l e   C h r o m e��  ��   $ O   	 � * + * k    � , ,  - . - r     / 0 / m     1 1 � 2 2  n u l l 0 o      ���� 0 ret   .  3 4 3 r     5 6 5 m     7 7 � 8 8  n u l l 6 o      ���� 0 a   4  9 : 9 r    & ; < ; N    $ = = l   # >���� > 6   # ? @ ? n     A B A 2   ��
�� 
CrTb B 2   ��
�� 
cwin @ E    " C D C 1    ��
�� 
URL  D m    ! E E � F F " y o u t u b e . c o m / w a t c h��  ��   < o      ����  0 youtubetabsref youtubeTabsRef :  G H G X   ' W I�� J I k   7 R K K  L M L r   7 @ N O N I  7 >�� P Q
�� .CrSuExJanull���     obj  P o   7 8���� 0 youtubetabs youtubeTabs Q �� R��
�� 
JvSc R m   9 : S S � T T� 
                     f u n c t i o n   g e t D a t a ( )   { 
                         t r y   { 
                             / /   y o u t u b e 
                             c o n s t   v i d e o   =   d o c u m e n t . q u e r y S e l e c t o r ( ' # m o v i e _ p l a y e r   >   d i v . h t m l 5 - v i d e o - c o n t a i n e r   >   v i d e o ' ) ; 
                               i f   ( ! v i d e o )   { 
                                 r e t u r n   ' n u l l ' ; 
                             } 
                             c o n s t   n a m e   =   d o c u m e n t . q u e r y S e l e c t o r ( ' # c o n t a i n e r   >   h 1 ' ) ? . i n n e r T e x t ? . r e p l a c e ( / \ ( o f f i c i a l   ( a u d i o | v i d e o | M V ) \ ) / i , ' ' ) ; 
                             c o n s t   {   c u r r e n t T i m e :   p o s i t i o n ,   d u r a t i o n   }   =   v i d e o ; 
                             r e t u r n   J S O N . s t r i n g i f y ( {   n a m e ,   d u r a t i o n ,   p o s i t i o n   } ) ; 
                         }   c a t c h   ( e )   { 
                             r e t u r n   ' n u l l ' ; 
                         } 
                     } 
                     g e t D a t a ( ) ; 
                ��   O o      ���� 0 a   M  U�� U Z   A R V W���� V >  A F X Y X o   A B���� 0 a   Y m   B E Z Z � [ [  n u l l W k   I N \ \  ] ^ ] r   I L _ ` _ o   I J���� 0 a   ` o      ���� 0 ret   ^  a�� a  S   M N��  ��  ��  ��  �� 0 youtubetabs youtubeTabs J o   * +����  0 youtubetabsref youtubeTabsRef H  b c b r   X k d e d N   X i f f l  X h g���� g 6  X h h i h n   X ] j k j 2  [ ]��
�� 
CrTb k 2  X [��
�� 
cwin i E   ^ g l m l 1   _ a��
�� 
URL  m m   b f n n � o o " m u s i c . y o u t u b e . c o m��  ��   e o      ���� *0 youtubemusictabsref youtubeMusicTabsRef c  p q p X   l � r�� s r k   | � t t  u v u r   | � w x w I  | ��� y z
�� .CrSuExJanull���     obj  y o   | }���� $0 youtubemusictabs youtubeMusicTabs z �� {��
�� 
JvSc { m   ~ � | | � } }* 
                     f u n c t i o n   g e t D a t a ( )   { 
                         t r y   { 
                             c o n s t   y t m u s i c   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . y t m u s i c - a p p ' ) ; 
                             c o n s t   v i d e o   =   d o c u m e n t . q u e r y S e l e c t o r ( ' v i d e o . v i d e o - s t r e a m . h t m l 5 - m a i n - v i d e o ' ) ; 
                               i f   ( ! y t m u s i c   | |   ! v i d e o )   { 
                                 r e t u r n   ' n u l l ' ; 
                             } 
                             c o n s t   a r t i s t   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . y t m u s i c - p l a y e r - b a r   . s u b t i t l e   a : n t h - c h i l d ( 1 ) ' ) . i n n e r T e x t ; 
                             c o n s t   n a m e   =   d o c u m e n t . q u e r y S e l e c t o r ( ' . y t m u s i c - p l a y e r - b a r   y t - f o r m a t t e d - s t r i n g ' ) . i n n e r T e x t ; 
                             c o n s t   {   c u r r e n t T i m e :   p o s i t i o n ,   d u r a t i o n   }   =   v i d e o ; 
                             r e t u r n   J S O N . s t r i n g i f y ( {   n a m e ,   a r t i s t ,   d u r a t i o n ,   p o s i t i o n   } ) ; 
                         }   c a t c h   ( e )   { 
 	 	 	 	 	 	     c o n s o l e . l o g ( e ) ; 
 
                             r e t u r n   ' n u l l ' ; 
                         } 
                     } 
                     g e t D a t a ( ) ; 
                ��   x o      ���� 0 a   v  ~�� ~ Z   � �  �����  >  � � � � � o   � ����� 0 a   � m   � � � � � � �  n u l l � k   � � � �  � � � r   � � � � � o   � ����� 0 a   � o      ���� 0 ret   �  ��� �  S   � ���  ��  ��  ��  �� $0 youtubemusictabs youtubeMusicTabs s o   o p���� *0 youtubemusictabsref youtubeMusicTabsRef q  � � � I  � ��� ���
�� .ascrcmnt****      � **** � o   � ����� 0 a  ��   �  � � � I  � ��� ���
�� .ascrcmnt****      � **** � o   � ����� 0 ret  ��   �  ��� � L   � � � � o   � ����� 0 ret  ��   + m   	 
 � ��                                                                                  rimZ  alis    >  Macintosh HD                   BD ����Google Chrome.app                                              ����            ����  
 cu             Applications  !/:Applications:Google Chrome.app/   $  G o o g l e   C h r o m e . a p p    M a c i n t o s h   H D  Applications/Google Chrome.app  / ��  ��   % L   � � � � m   � � � � � � �  n u l l    � � � l     ��������  ��  ��   �  � � � i     � � � I     ������
�� .aevtoappnull  �   � ****��  ��   � L      � � I     �������� "0 getcurrenttrack GetCurrentTrack��  ��   �  ��� � l     ��������  ��  ��  ��       �� � � � ���   � �������� ,0 applicationisrunning ApplicationIsRunning�� "0 getcurrenttrack GetCurrentTrack
�� .aevtoappnull  �   � **** � �� ���� � ����� ,0 applicationisrunning ApplicationIsRunning�� �� ���  �  ���� 0 appname appName��   � ������ 0 appname appName�� $0 appnameisrunning appNameIsRunning �  �� �����
�� 
prcs �  
�� 
pnam
�� .coredoexnull���     ****�� � *�-�[�,\Z�81j E�UO� � �� "���� � ����� "0 getcurrenttrack GetCurrentTrack��  ��   � �������������� 0 ret  �� 0 a  ��  0 youtubetabsref youtubeTabsRef�� 0 youtubetabs youtubeTabs�� *0 youtubemusictabsref youtubeMusicTabsRef�� $0 youtubemusictabs youtubeMusicTabs �  (�� � 1 7���� ��� E�������� S�� Z n | ��� ��� ,0 applicationisrunning ApplicationIsRunning
�� 
cwin
�� 
CrTb
�� 
URL 
�� 
kocl
�� 
cobj
�� .corecnte****       ****
�� 
JvSc
�� .CrSuExJanull���     obj 
�� .ascrcmnt****      � ****�� �*�k+  �� ��E�O�E�O*�-�-�[�,\Z�@1E�O /�[��l kh ���l E�O�a  
�E�OY h[OY��O*�-�-�[�,\Za @1E�O 1�[��l kh ��a l E�O�a  
�E�OY h[OY��O�j O�j O�UY a  � �� ���� � ��~
�� .aevtoappnull  �   � ****��  �   �   � �}�} "0 getcurrenttrack GetCurrentTrack�~ *j+   ascr  ��ޭ