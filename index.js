local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local Debris = game:GetService("Debris") -- Serviço que remove itens do mapa

-- URL DO RAILWAY ATUALIZADA COM O SEU DOMÍNIO REAL
local RAILWAY_URL = "https://tiktok-server-production-848c.up.railway.app/get-events"

-- CONFIGURAÇÕES
local TEMPO_DE_VIDA = 60 -- Segundos que o boneco fica na tela antes de sumir
local spawnLocation = Vector3.new(0, 5, 0)

-- Lista de animações de dança (o jogo vai escolher uma aleatória para cada pessoa)
local danceAnimations = {
    "rbxassetid://507771019",
    "rbxassetid://3333331310",
    "rbxassetid://4297326325",
    "rbxassetid://4049037604"
}

local function spawnUser(username)
    if not username or type(username) ~= "string" then return end
    
    username = string.gsub(username, "^%s*(.-)%s*$", "%1") 
    local success, userId = pcall(function() return Players:GetUserIdFromNameAsync(username) end)
    
    if success and userId then
        local successDesc, desc = pcall(function() return Players:GetHumanoidDescriptionFromUserId(userId) end)
        
        if successDesc then
            local char = Players:CreateHumanoidModelFromDescription(desc, Enum.HumanoidRigType.R15)
            char.Name = username
            
            -- Letreiro com o nome do espectador
            local bb = Instance.new("BillboardGui")
            bb.Size = UDim2.new(0, 100, 0, 50)
            bb.StudsOffset = Vector3.new(0, 3, 0)
            bb.Adornee = char:WaitForChild("Head")
            local txt = Instance.new("TextLabel", bb)
            txt.Size = UDim2.new(1, 0, 1, 0)
            txt.BackgroundTransparency = 1
            txt.Text = username
            txt.TextScaled = true
            txt.TextColor3 = Color3.new(1, 1, 1)
            txt.TextStrokeTransparency = 0
            txt.Font = Enum.Font.GothamBold -- Fonte mais bonita e visível na live
            bb.Parent = char

            -- Desativa a colisão de todas as partes do corpo para evitar travamentos
            for _, part in pairs(char:GetDescendants()) do
                if part:IsA("BasePart") then
                    part.CanCollide = false
                end
            end

            -- Posiciona em uma área um pouco mais espalhada
            char:PivotTo(CFrame.new(spawnLocation + Vector3.new(math.random(-15, 15), 0, math.random(-15, 15))))
            char.Parent = workspace

            -- Programa a exclusão automática do boneco após o tempo de vida
            Debris:AddItem(char, TEMPO_DE_VIDA)

            -- Animação de dança aleatória
            local hum = char:FindFirstChild("Humanoid")
            local animator = hum:FindFirstChild("Animator") or Instance.new("Animator", hum)
            local anim = Instance.new("Animation")
            anim.AnimationId = danceAnimations[math.random(1, #danceAnimations)]
            
            local track = animator:LoadAnimation(anim)
            track.Looped = true
            track:Play()
        end
    end
end

while true do
    local s, res = pcall(function() return HttpService:GetAsync(RAILWAY_URL) end)
    if s then
        local s2, events = pcall(function() return HttpService:JSONDecode(res) end)
        if s2 and type(events) == "table" then
            for _, eventData in ipairs(events) do
                if eventData and eventData.username then
                    task.spawn(spawnUser, eventData.username)
                end
            end
        end
    end
    task.wait(2)
end
