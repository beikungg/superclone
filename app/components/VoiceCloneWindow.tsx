"use client"

import { useState, useEffect } from "react"
import { Upload, Table, Button, Modal, message, Input, Alert } from "antd"
import { DeleteOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import axios from "axios"
import { motion } from "framer-motion"

const { Dragger } = Upload

interface FileItem {
    uid: string
    name: string
    url: string
    type: string
    resulturl: string
    personid: number
    resultname: string
}

interface CharacterItem {
    key: string
    personid: number
    personName: string
    personSex: string
    personIntroduction: string
    personVoiceUrl: string
    loaded: boolean
}

export default function VoiceCloneWindow() {
    const [fileList, setFileList] = useState<FileItem[]>([])
    const [tempList, setTempList] = useState<FileItem[]>([])
    const [searchText, setSearchText] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [tipsLoading, setTipsLoading] = useState(false)
    const [moxingLoading, setMoxingLoading] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [loading, setLoading] = useState<Record<string, boolean>>({})
    const [tempvalue, setTempvalue] = useState("")
    const [characterDataSource, setCharacterDataSource] = useState<CharacterItem[]>([
        {
            key: "1",
            personid: 0,
            personName: "干净男声",
            personSex: "男",
            personIntroduction: "中青年 温和 成熟 温暖",
            personVoiceUrl: "data1/pengfei/voice/pxp2_540.wav",
            loaded: false,
        },
        {
            key: "2",
            personid: 1,
            personName: "干净女声",
            personSex: "女",
            personIntroduction: "青少年 认真 朝气 谨慎",
            personVoiceUrl: "data1/xiaoqingnv/voice/default.wav",
            loaded: false,
        },
        {
            key: "3",
            personid: 2,
            personName: "TomZZP",
            personSex: "男",
            personIntroduction: "青年 中低音 微磁性 平实",
            personVoiceUrl: "data1/zzp/voice/default.wav",
            loaded: false,
        }
    ])

    const columns = [
        {
            title: "源音名称",
            dataIndex: "name",
            key: "name",
            width: "180px",
            ellipsis: true,
        },
        {
            title: "源音播放",
            key: "play",
            dataIndex: "url",
            width: "220px",
            ellipsis: true,
            render: (url: string) => (
                <audio controls style={{ width: "300px", marginTop: "10px" }}>
                    <source src={url} type="audio/mpeg" />
                </audio>
            ),
        },
        {
            title: "选择音色",
            key: "characterSelection",
            dataIndex: "uid",
            width: "80px",
            ellipsis: true,
            render: (uid: string) => (
                <Button onClick={() => showCharacterInfo(uid)}>选择音色</Button>
            ),
        },
        {
            title: "音色来源",
            key: "voicename",
            dataIndex: "personid",
            width: "80px",
            ellipsis: true,
            render: (personid: number) => showVoiceName(personid),
        },
        {
            title: "一键转换",
            key: "action",
            dataIndex: "uid",
            width: "100px",
            ellipsis: true,
            render: (uid: string) => (
                <Button
                    loading={loading[uid]}
                    onClick={() => convertAudio(uid)}
                >
                    一键转换
                </Button>
            ),
        },
        {
            title: "转换结果",
            key: "result",
            dataIndex: "resulturl",
            width: "220px",
            ellipsis: true,
            render: (resulturl: string) => (
                <audio src={resulturl} controls style={{ width: "300px", marginTop: "10px" }} />
            ),
        },
        {
            title: "下载音频",
            key: "download",
            dataIndex: "resulturl",
            width: "100px",
            ellipsis: true,
            render: (resulturl: string) => (
                <Button
                    disabled={resulturl === "1"}
                    onClick={() => downloadLink(resulturl)}
                    style={{ width: "100px", height: "50px" }}
                >
                    <VerticalAlignBottomOutlined style={{ fontSize: "30px" }} />
                </Button>
            ),
        },
        {
            title: "删除音频",
            key: "delete",
            dataIndex: "uid",
            width: "100px",
            ellipsis: true,
            render: (uid: string) => (
                <DeleteOutlined
                    style={{ fontSize: "30px", marginLeft: "10px" }}
                    onClick={() => confirmDeleteSingle(uid)}
                />
            ),
        },
    ]

    const characterColumns = [
        {
            title: "Our TomCats",
            dataIndex: "personName",
            key: "name",
            width: "100px",
            ellipsis: true,
        },
        {
            title: "声音性别",
            key: "sex",
            dataIndex: "personSex",
            width: "100px",
            ellipsis: true,
        },
        {
            title: "音色描述",
            key: "introduction",
            dataIndex: "personIntroduction",
            width: "150px",
            ellipsis: true,
        },
        {
            title: "音色试听",
            key: "listenVoice",
            dataIndex: "personVoiceUrl",
            width: "200px",
            ellipsis: true,
            render: (url: string) => (
                <audio controls style={{ width: "240px" }}>
                    <source src={url} type="audio/mpeg" />
                </audio>
            ),
        },
        {
            title: "选择音色",
            key: "selectcharacter",
            dataIndex: "personid",
            width: "100px",
            ellipsis: true,
            render: (personid: number) => (
                <Button onClick={() => selectMorePersonVoice(personid)}>选择音色</Button>
            ),
        },
    ]

    useEffect(() => {
        getPersonVoice()
        const handleBeforeUnload = () => {
            // clearModel()
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    const clearModel = async () => {
        await axios.get(`tools/clearModel`)
    }

    const getPersonVoice = async () => {
        for (const item of characterDataSource) {
            const response = await axios.get(`tools/get_audio1?path=${item.personVoiceUrl}`, {
                responseType: "blob",
            })
            const audioBlob = new Blob([response.data])
            const newFile = new File([audioBlob], "random.mp3")
            item.personVoiceUrl = URL.createObjectURL(newFile)
        }
        setCharacterDataSource([...characterDataSource])
    }

    const convertPath = (tempid: number) => {
        switch (tempid) {
            case 0:
                return "data1/pengfei/models"
            case 1:
                return "data1/xiaoqingnv/models"
            case 2:
                return "data1/zzp/models"
            default:
                return ""
        }
    }

    const convertModelName = (tempid: number) => {
        switch (tempid) {
            case 0:
                return "100percent"
            case 1:
                return "xiaoqingnv"
            case 2:
                return "zzp"
            default:
                return ""
        }
    }

    const showVoiceName = (tempid: number) => {
        switch (tempid) {
            case -1:
                return "未选择"
            case 0:
                return "干净男声"
            case 1:
                return "干净女声"
            case 2:
                return "TomZZP"
            default:
                return "未知"
        }
    }

    const handleBeforeUpload = (file: File) => {
        const url = URL.createObjectURL(file)
        setFileList((prev) => [
            ...prev,
            {
                uid: file.uid,
                name: file.name,
                url,
                type: file.type,
                resulturl: "1",
                personid: -1,
                resultname: "",
            },
        ])
        return false
    }

    const showCharacterInfo = (uid: string) => {
        setTempvalue(uid)
        setModalVisible(true)
    }

    const closeCharacterInfo = () => {
        setModalVisible(false)
    }

    const selectPersonVoice = (uid: string, personid: number) => {
        setFileList((prev) =>
            prev.map((item) =>
                item.uid === uid ? { ...item, personid } : item
            )
        )
        setModalVisible(false)
    }

    const selectMorePersonVoice = (personid: number) => {
        setFileList((prev) =>
            prev.map((item) =>
                selectedRowKeys.includes(item.uid) ? { ...item, personid } : item
            )
        )
        setModalVisible1(false)
    }

    const convertAudio = async (uid: string) => {
        const url = "/voice2"
        const convertList = fileList.filter((item) => item.uid === uid)
        if (convertList.length > 0) {
            for (const item of convertList) {
                if (item.personid !== -1) {
                    message.success(`正在转换 ${item.name}`)
                    setLoading((prev) => ({ ...prev, [uid]: true }))
                    const params = {
                        name: item.name,
                        sid: convertModelName(item.personid),
                        speaker_num: String(item.personid),
                    }
                    const response = await fetch(item.url)
                    const blob = await response.blob()
                    const audio_file = new File([blob], item.name)
                    const formData = new FormData()
                    formData.append("file", audio_file)

                    let retry1 = true
                    while (retry1) {
                        try {
                            const response1 = await axios.post(url, formData, {
                                timeout: 120000,
                                params,
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            if (response1.status === 200) {
                                setLoading((prev) => ({ ...prev, [uid]: false }))
                                retry1 = false
                                message.success(`${item.name}转换成功`)
                                const data = response1.data.data
                                const audioPath = data.audio_path
                                item.resultname = data.resultname

                                let retry = true
                                while (retry) {
                                    try {
                                        const response2 = await axios.get(`tools/get_audio1?path=${audioPath}`, {
                                            responseType: "blob",
                                        })
                                        if (response2.status === 200) {
                                            item.resulturl = URL.createObjectURL(response2.data)
                                            retry = false
                                        }
                                    } catch (error) {
                                        console.error("Error fetching audio:", error)
                                    }
                                }
                            }
                        } catch (error) {
                            message.error(`${item.name}转换失败`)
                            setLoading((prev) => ({ ...prev, [uid]: false }))
                            retry1 = false
                        }
                    }
                } else {
                    message.error(`${item.name}未选择音色`)
                }
            }
        } else {
            message.warning("未找到匹配的音频文件")
        }
    }

    const confirmDeleteSingle = (uid: string) => {
        Modal.confirm({
            title: "确认删除",
            content: "确定要删除选中的这个音频文件吗？",
            onOk: () => deleteUrl(uid),
        })
    }

    const deleteUrl = (uid: string) => {
        setFileList((prev) => prev.filter((item) => item.uid !== uid))
        setTempList((prev) => prev.filter((item) => item.uid !== uid))
        message.success("该音频文件已删除")
    }

    const downloadLink = (fileUrl: string) => {
        const item = fileList.find((item) => item.resulturl === fileUrl)
        if (item) {
            const downloadLink = document.createElement("a")
            downloadLink.href = fileUrl
            downloadLink.download = item.resultname
            downloadLink.click()
        }
    }

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-primary mb-4">SUPERCLONE</h1>
                    <p className="text-xl text-muted-foreground mb-8">上传您的音频文件,体验AI语音克隆的魅力</p>
                    <Dragger
                        name="file"
                        multiple
                        showUploadList={false}
                        beforeUpload={handleBeforeUpload}
                        accept="audio/*"
                        className="h-48 bg-background border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
                    >
                        <p className="ant-upload-text mt-16 text-lg text-muted-foreground">点击或拖拽</p>
                        <p className="ant-upload-hint text-muted-foreground">单个或者多个音频文件</p>
                    </Dragger>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-card rounded-lg shadow-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-6">上传的音频文件</h2>
                    <div className="mb-6 flex flex-wrap gap-4">
                        <Input
                            placeholder="搜索文件名"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="max-w-md"
                        />
                        <Button
                            type="primary"
                            disabled={fileList.length === 0}
                            onClick={() => {
                                if (fileList.length < tempList.length) {
                                    setFileList(tempList)
                                } else {
                                    setTempList(fileList)
                                }
                                if (searchText === "") {
                                    setFileList(tempList)
                                } else {
                                    setFileList(fileList.filter((item) =>
                                        item.name.includes(searchText)
                                    ))
                                }
                            }}
                        >
                            搜索
                        </Button>
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => {
                                Modal.confirm({
                                    title: "确认删除",
                                    content: "确定要删除选中的所有音频文件吗？",
                                    onOk: () => {
                                        setFileList((prev) =>
                                            prev.filter((item) => !selectedRowKeys.includes(item.uid))
                                        )
                                        setTempList((prev) =>
                                            prev.filter((item) => !selectedRowKeys.includes(item.uid))
                                        )
                                        setSelectedRowKeys([])
                                        message.success("选中的文件已删除")
                                    },
                                })
                            }}
                        >
                            批量删除
                        </Button>
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => setModalVisible1(true)}
                        >
                            批量选音
                        </Button>
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => {
                                selectedRowKeys.forEach((uid) => {
                                    const button = document.querySelector(`[data-uid="${uid}"]`)
                                    if (button) {
                                        button.click()
                                    }
                                })
                            }}
                        >
                            批量转换
                        </Button>
                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => {
                                const downloadList = fileList.filter((item) =>
                                    selectedRowKeys.includes(item.uid)
                                )
                                downloadList.forEach((item) => {
                                    if (item.resulturl !== "1") {
                                        const downloadLink = document.createElement("a")
                                        downloadLink.href = item.resulturl
                                        downloadLink.download = item.resultname
                                        downloadLink.click()
                                    }
                                })
                            }}
                        >
                            批量下载
                        </Button>
                        <Button
                            type="primary"
                            disabled={fileList.length === 0}
                            onClick={() => {
                                Modal.confirm({
                                    title: "确认清空",
                                    content: "确定要清空页面所有音频文件吗？",
                                    onOk: () => {
                                        setFileList([])
                                        setTempList([])
                                        setSelectedRowKeys([])
                                        message.success("页面已清空")
                                    },
                                })
                            }}
                        >
                            清空列表
                        </Button>
                        <Button
                            type="primary"
                            disabled={tipsLoading}
                            onClick={() => setTipsLoading(true)}
                        >
                            使用提示
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={fileList}
                        rowKey="uid"
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (keys) => setSelectedRowKeys(keys as string[]),
                        }}
                        className="bg-card"
                    />
                </motion.div>
            </div>

            <Modal
                title="音色信息"
                open={modalVisible}
                onOk={closeCharacterInfo}
                onCancel={closeCharacterInfo}
                width={1400}
                className="bg-card"
            >
                <Modal
                    open={moxingLoading}
                    footer={null}
                    closable={false}
                >
                    预载模型大概需要15秒时间，请耐心等待owo...
                </Modal>
                <Alert
                    message="可以尝试转换多个音频，可以大幅提高推理速度 ^w^"
                    type="success"
                />
                <Table
                    columns={characterColumns}
                    dataSource={characterDataSource}
                    rowKey="personid"
                    pagination={false}
                    className="bg-card"
                />
            </Modal>

            <Modal
                title="音色信息"
                open={modalVisible1}
                onOk={() => setModalVisible1(false)}
                onCancel={() => setModalVisible1(false)}
                width={1400}
                className="bg-card"
            >
                <Modal
                    open={moxingLoading}
                    footer={null}
                    closable={false}
                >
                    预载模型大概需要15秒时间，请耐心等待owo...
                </Modal>
                <Alert
                    message="可以尝试转换多个音频，可以大幅提高推理速度 ^w^"
                    type="success"
                />
                <Table
                    columns={characterColumns}
                    dataSource={characterDataSource}
                    rowKey="personid"
                    pagination={false}
                    className="bg-card"
                />
            </Modal>

            <Modal
                title="使用提示"
                open={tipsLoading}
                onOk={() => setTipsLoading(false)}
                onCancel={() => setTipsLoading(false)}
                width={800}
                className="bg-card"
            >
                <Alert
                    message="1、音频转换中间有文件传输过程，为保证转换速度，请尽量不要传输过大文件(建议10mb以内) ૮₍ •̥𖥦•̥ ♡ ₎ა"
                    type="success"
                    className="mb-4"
                />
                <Alert
                    message="2、长音频推理时有音频切片过程，为保证转换速度，请尽量不要传输过长文件(建议60s以内,越短越快) ૮⌯'ㅅ'⌯ ა"
                    type="success"
                    className="mb-4"
                />
                <Alert
                    message="3、音频转换中间有文件传输过程，为保证转换速度，建议您在良好的网络连接速度下转换(避免使用代理) ⊂₍ •ᴥ• ₎っ"
                    type="success"
                />
            </Modal>
        </div>
    )
} 