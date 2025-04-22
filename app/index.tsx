import styled from "styled-components/native";
import { useEffect, useState } from "react";
import InputTexto from "../components/Input/input";
import { Alert, View } from "react-native";
import { api } from "../utils/utils";

export default function App() {

    const [email, setEmail] = useState('');
    const [hasEmailError, setHasEmailError] = useState(false);

    const [senha, setSenha] = useState('');
    const [hasSenhaError, setHasSenhaError] = useState(false);

    const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
    const [senhasDiferentes, setSenhasDiferentes] = useState(false);

    const [invalidLogin, setInvalidLogin] = useState(false);
    const [formularioValido, setFormularioValido] = useState(false);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        const emailValido = emailRegex.test(email);
        const senhaValida = senhaRegex.test(senha);
        const senhaIgual = senha === senhaConfirmacao;

        setHasEmailError(email.length > 0 && !emailValido);
        setHasSenhaError(senha.length > 0 && !senhaValida);
        setSenhasDiferentes(senha.length > 0 && senhaConfirmacao.length > 0 && !senhaIgual);

        setFormularioValido(emailValido && senhaValida && senhaIgual);
    }, [email, senha, senhaConfirmacao]);

    async function Cadastrar() {
        try {
            await api.post('/cadastrar', {
                email: email,
                senha: senha
            });
            alert("Usuário cadastrado com sucesso!");
        } catch (error) {
            console.log(error);
            alert('Ops... Usuário ou senha incorretos');
        }
    }

    return (
        <Tela>
            <Title>Criar conta</Title>

            <ContainerCampoTexto>
                <View>
                    <InputTexto
                        erro={hasEmailError}
                        placeholder="Digite seu email..."
                        onChangeText={text => setEmail(text)}
                    />
                    {hasEmailError ? <TextErrorHint>E-mail inválido</TextErrorHint> : null}
                </View>

                <View>
                    <InputTexto
                        erro={hasSenhaError}
                        placeholder="Digite sua senha..."
                        onChangeText={text => setSenha(text)}
                        segura={true}
                    />
                    {hasSenhaError ? <TextErrorHint>Senha inválida</TextErrorHint> : null}
                </View>

                <View>
                    <InputTexto
                        erro={senhasDiferentes}
                        placeholder="Confirme sua senha..."
                        onChangeText={text => setSenhaConfirmacao(text)}
                        segura={true}
                    />
                    {senhasDiferentes ? <TextErrorHint>Senhas não coincidem</TextErrorHint> : null}
                </View>
            </ContainerCampoTexto>

            <ContainerBotoes>
                <Botao
                    disabled={!formularioValido}
                    onPress={() => { Cadastrar(); }}
                >
                    <TextoBotao>Cadastrar</TextoBotao>
                </Botao>

                {invalidLogin ? <TextErrorHint>Usuário ou senha incorretos</TextErrorHint> : null}
            </ContainerBotoes>
        </Tela>
    );
}

const Title = styled.Text`
    font-size: 40px;
    font-weight: bold;
    color: #ff00b7;
    margin-bottom: 60px;
`;

const Tela = styled.View`
    flex: 1;
    background-color: #ffaff0;
    padding: 26px;
`;

const ContainerCampoTexto = styled.View`
    gap: 25px;
`;

const ContainerBotoes = styled.View`
    margin-top: 65px;
    gap: 20px;
`;

const Botao = styled.Pressable`
    background-color: #f718b8;
    padding: 20px;
    border-radius: 6px;
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const TextoBotao = styled.Text`
    text-align: center;
    font-size: 24px;
    color: #fff;
`;

const TextErrorHint = styled.Text`
    font-size: 16px;
    color: #E63946;
`;
